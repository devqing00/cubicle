"use client";

import React, { useState, useMemo, useEffect } from "react";
import HugeIcon from "@/components/ui/HugeIcon";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NativeSchedulerProps {
  selectedTier: "trial" | "standard" | "intensive";
  onSelectSlot: (slot: { date: string; time: string; formattedDate: string }) => void;
  onBack: () => void;
  loading?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to format local Date into YYYY-MM-DD without UTC timezone rollback
function formatYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to check if a slot is in the past for the selected date (with 15 min buffer)
function isSlotInPast(date: Date, slotTimeStr: string): boolean {
  const now = new Date();
  const targetDate = new Date(date);

  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  if (!isToday) {
    return targetDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  }

  const match = slotTimeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return false;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hour < 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;

  targetDate.setHours(hour, minute, 0, 0);
  return targetDate.getTime() < now.getTime() + 15 * 60 * 1000;
}

// Standard slot offerings per tier aligned with tutor working hours (WAT)
const SLOTS_BY_TIER: Record<string, string[]> = {
  trial: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM", "04:30 PM"],
  standard: ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
  intensive: ["09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM"],
};

export default function NativeScheduler({
  selectedTier,
  onSelectSlot,
  onBack,
  loading = false,
}: NativeSchedulerProps) {
  const today = useMemo(() => new Date(), []);
  
  // Current calendar view (month/year)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Tutor Availability state
  const [tutorSchedule, setTutorSchedule] = useState<Record<number, { active: boolean; startTime: string; endTime: string }>>({
    1: { active: true, startTime: "09:00", endTime: "17:00" },
    2: { active: true, startTime: "09:00", endTime: "17:00" },
    3: { active: true, startTime: "09:00", endTime: "17:00" },
    4: { active: true, startTime: "09:00", endTime: "17:00" },
    5: { active: true, startTime: "09:00", endTime: "17:00" },
    6: { active: false, startTime: "09:00", endTime: "17:00" },
    0: { active: false, startTime: "09:00", endTime: "17:00" },
  });
  const [tutorOverrides, setTutorOverrides] = useState<string[]>([]);
  const [bookedTimesForSelectedDate, setBookedTimesForSelectedDate] = useState<string[]>([]);

  // Load tutor availability
  useEffect(() => {
    fetch("/api/tutor/availability")
      .then(res => res.json())
      .then(data => {
        if (data?.schedule) setTutorSchedule(data.schedule);
        if (data?.overrides) {
          setTutorOverrides(data.overrides.map((o: { date: string }) => o.date));
        }
      })
      .catch(console.error);
  }, []);

  // Selected date & time
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + 1);
    return nextDay;
  });
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");

  // Real-time conflict detector for selected date
  useEffect(() => {
    const isoDate = formatYMD(selectedDate);
    const q = query(
      collection(db, "bookings"),
      where("scheduledDate", "==", isoDate)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taken: string[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status !== "cancelled" && data.scheduledTime) {
          taken.push(data.scheduledTime);
        }
      });
      setBookedTimesForSelectedDate(taken);
    }, (err) => {
      console.warn("Bookings listener error:", err);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  // Timezone display
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";

  // Calculate calendar grid days with tutor schedule awareness
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Adjust Sunday (0) to index 6 for Mon-Sun layout
    const startOffset = (firstDayIndex + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; dateObj: Date; isPast: boolean; isAvailable: boolean }> = [];

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const isoDateStr = formatYMD(dateObj);
      // Strip time for exact date comparison
      const isPast = dateObj.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday
      const isTutorWorkingDay = tutorSchedule[dayOfWeek]?.active ?? (dayOfWeek !== 0);
      const isOverrideOff = tutorOverrides.includes(isoDateStr);

      days.push({
        day: d,
        isCurrentMonth: true,
        dateObj,
        isPast,
        isAvailable: !isPast && isTutorWorkingDay && !isOverrideOff,
      });
    }

    return { days, startOffset };
  }, [currentMonth, currentYear, tutorSchedule, tutorOverrides]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const isSelectedDate = (dateObj: Date) => {
    return (
      selectedDate.getFullYear() === dateObj.getFullYear() &&
      selectedDate.getMonth() === dateObj.getMonth() &&
      selectedDate.getDate() === dateObj.getDate()
    );
  };

  const formattedDateDisplay = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const durationLabel = selectedTier === "trial" ? "30 min" : selectedTier === "standard" ? "60 min" : "90 min";
  const availableSlots = SLOTS_BY_TIER[selectedTier] || SLOTS_BY_TIER.standard;

  const handleConfirm = () => {
    const isoDate = formatYMD(selectedDate);
    onSelectSlot({
      date: isoDate,
      time: selectedTime,
      formattedDate: `${formattedDateDisplay} at ${selectedTime}`,
    });
  };

  return (
    <div className="bg-white rounded-[28px] border border-border-light shadow-sm overflow-hidden p-6 sm:p-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20">
              {selectedTier.toUpperCase()} SESSION
            </span>
            <span className="text-xs text-text-secondary font-medium">
              • {durationLabel} 1-on-1 Lesson
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
            Select Date & Time
          </h2>
        </div>

        <button
          onClick={onBack}
          className="self-start sm:self-auto text-xs font-semibold text-text-secondary hover:text-accent-blue transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-light hover:bg-surface-muted"
        >
          <HugeIcon name="chevron-left" size={14} />
          <span>Change Tier</span>
        </button>
      </div>

      {/* Main Grid: Calendar & Time Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Side: Calendar (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Month Header Nav */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-base font-bold text-text-primary">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
                className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous month"
              >
                <HugeIcon name="chevron-left" size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                aria-label="Next month"
              >
                <HugeIcon name="chevron-right" size={16} />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-heading text-xs font-bold text-text-secondary mb-1">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Start Offset blanks */}
            {Array.from({ length: calendarDays.startOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-10 sm:h-12" />
            ))}

            {/* Days of Month */}
            {calendarDays.days.map(({ day, dateObj, isAvailable }) => {
              const selected = isSelectedDate(dateObj);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`h-10 sm:h-12 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center relative ${
                    selected
                      ? "bg-text-primary text-white shadow-xs font-bold"
                      : isAvailable
                      ? "text-text-primary hover:bg-accent-blue/10 hover:text-accent-blue cursor-pointer"
                      : "text-text-subtle/40 cursor-not-allowed line-through decoration-text-subtle/20"
                  }`}
                  aria-label={`${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}`}
                >
                  <span>{day}</span>
                  {isAvailable && !selected && (
                    <span className="w-1 h-1 bg-accent-blue rounded-full absolute bottom-1.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Timezone Indicator */}
          <div className="pt-4 flex items-center gap-2 text-xs text-text-secondary">
            <HugeIcon name="clock" size={14} className="text-accent-blue shrink-0" />
            <span>Timezone: <strong className="text-text-primary font-semibold">{userTimeZone}</strong></span>
          </div>
        </div>

        {/* Right Side: Time Slots & Summary (5 cols) */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border-light lg:pl-8 pt-6 lg:pt-0 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading text-sm font-bold text-text-primary">
                Available Slots
              </h4>
              <span className="text-[11px] font-medium text-text-secondary">
                {formattedDateDisplay}
              </span>
            </div>

            {/* Slot Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {availableSlots.map(time => {
                const isPastTime = isSlotInPast(selectedDate, time);
                const isAlreadyBooked = bookedTimesForSelectedDate.includes(time);
                const isDisabled = isAlreadyBooked || isPastTime;
                const isTimeSelected = selectedTime === time && !isDisabled;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-3 rounded-2xl border text-xs font-heading font-bold transition-all flex items-center justify-between group ${
                      isDisabled
                        ? "border-border-light bg-surface-muted/60 text-text-subtle/50 cursor-not-allowed line-through"
                        : isTimeSelected
                        ? "border-text-primary bg-text-primary text-white shadow-xs"
                        : "border-border-light bg-surface-near-white text-text-primary hover:border-accent-blue hover:bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <HugeIcon
                        name="clock"
                        size={14}
                        className={
                          isDisabled
                            ? "text-text-subtle/40"
                            : isTimeSelected
                            ? "text-accent-blue"
                            : "text-text-secondary group-hover:text-accent-blue"
                        }
                      />
                      {time}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDisabled
                        ? "text-red-400 no-underline"
                        : isTimeSelected
                        ? "text-accent-blue"
                        : "text-text-subtle"
                    }`}>
                      {isAlreadyBooked ? "Booked" : isPastTime ? "Passed" : isTimeSelected ? "Selected" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Overview Card */}
          <div className="bg-surface-near-white p-4 rounded-2xl border border-border-light space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Meeting Format</span>
              <span className="font-bold text-text-primary flex items-center gap-1">
                <HugeIcon name="sparkles" size={12} className="text-accent-blue" />
                Google Meet 1-on-1
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Duration</span>
              <span className="font-bold text-text-primary">{durationLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Price</span>
              <span className="font-bold text-text-primary">
                {selectedTier === "trial" ? "Free (₦0)" : selectedTier === "standard" ? "₦15,000" : "₦25,000"}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-4 bg-accent-blue text-white rounded-full font-body text-xs font-semibold hover:bg-accent-blue-hover transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Reservation...</span>
              </>
            ) : (
              <>
                <span>Confirm Slot & Verify</span>
                <HugeIcon name="arrow-right" size={16} />
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
