"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { ClockIcon, CalendarIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

// Days of the week mapping
const DAYS = [
  { id: 1, label: "Monday" },
  { id: 2, label: "Tuesday" },
  { id: 3, label: "Wednesday" },
  { id: 4, label: "Thursday" },
  { id: 5, label: "Friday" },
  { id: 6, label: "Saturday" },
  { id: 0, label: "Sunday" },
];

export default function AvailabilityPage() {
  const { userData, loading: authLoading } = useAuth();
  
  // Default to Mon-Fri 9-5
  const [schedule, setSchedule] = useState<Record<number, { active: boolean; startTime: string; endTime: string }>>({
    1: { active: true, startTime: "09:00", endTime: "17:00" },
    2: { active: true, startTime: "09:00", endTime: "17:00" },
    3: { active: true, startTime: "09:00", endTime: "17:00" },
    4: { active: true, startTime: "09:00", endTime: "17:00" },
    5: { active: true, startTime: "09:00", endTime: "17:00" },
    6: { active: false, startTime: "09:00", endTime: "17:00" },
    0: { active: false, startTime: "09:00", endTime: "17:00" },
  });
  
  const [overrides, setOverrides] = useState<{ id: string; date: string; reason: string }[]>([]);
  const [newOverride, setNewOverride] = useState({ date: "", reason: "" });
  
  const [isSaving, setIsSaving] = useState(false);



  const toggleDay = (dayId: number) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], active: !prev[dayId].active }
    }));
  };

  const updateTime = (dayId: number, field: "startTime" | "endTime", value: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  const addOverride = () => {
    if (!newOverride.date) return toast.error("Date is required");
    setOverrides([...overrides, { id: Math.random().toString(), ...newOverride }]);
    setNewOverride({ date: "", reason: "" });
  };

  const removeOverride = (id: string) => {
    setOverrides(overrides.filter(o => o.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule, overrides }),
      });

      if (!response.ok) {
        throw new Error("Failed to save schedule");
      }

      toast.success("Schedule updated successfully on Cal.com!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving your schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="animate-pulse">Loading availability...</div>;

  if (userData?.role !== "tutor") {
    return <div>Unauthorized access.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-oboe-black mb-2">Availability</h1>
          <p className="font-body text-mid-gray-brown">Manage your weekly working hours.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.info("Google Calendar sync will be added soon!")}
            className="px-6 py-2.5 bg-white border border-border-warm text-dark-charcoal rounded-full font-body font-medium flex items-center gap-2 hover:bg-surface-base transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            Sync Calendar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-oboe-black text-white rounded-full font-body font-medium hover:bg-dark-charcoal transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-border-warm pb-6">
          <div className="p-3 bg-chip-yellow rounded-xl">
            <ClockIcon className="w-6 h-6 text-dark-charcoal" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-oboe-black">Weekly Hours</h3>
            <p className="font-body text-sm text-mid-gray-brown">These hours dictate when students can book you.</p>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl">
          {DAYS.map(day => (
            <div key={day.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-2 border-b border-border-warm/50 last:border-0 pb-6 last:pb-0">
              
              <div className="w-40 flex items-center gap-3">
                <button
                  onClick={() => toggleDay(day.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${schedule[day.id].active ? 'bg-highlight-green' : 'bg-surface-base border border-border-warm'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${schedule[day.id].active ? 'translate-x-6' : 'translate-x-0 bg-mid-gray-brown'}`} />
                </button>
                <span className={`font-body font-medium ${schedule[day.id].active ? 'text-oboe-black' : 'text-mid-gray-brown'}`}>
                  {day.label}
                </span>
              </div>

              {schedule[day.id].active ? (
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    type="time" 
                    value={schedule[day.id].startTime}
                    onChange={(e) => updateTime(day.id, "startTime", e.target.value)}
                    className="p-3 bg-surface-base border border-border-warm rounded-xl font-body text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                  />
                  <span className="text-mid-gray-brown">to</span>
                  <input 
                    type="time" 
                    value={schedule[day.id].endTime}
                    onChange={(e) => updateTime(day.id, "endTime", e.target.value)}
                    className="p-3 bg-surface-base border border-border-warm rounded-xl font-body text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
                  />
                </div>
              ) : (
                <div className="flex-1 text-mid-gray-brown font-body italic text-sm py-3">
                  Unavailable
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-8 border-b border-border-warm pb-6">
          <div className="p-3 bg-chip-pink rounded-xl">
            <CalendarIcon className="w-6 h-6 text-dark-charcoal" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-oboe-black">Date Overrides</h3>
            <p className="font-body text-sm text-mid-gray-brown">Block off specific dates for holidays or time off.</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-end gap-4 mb-6 p-4 bg-surface-base rounded-2xl border border-border-warm">
            <div className="flex-1">
              <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Date</label>
              <input 
                type="date"
                value={newOverride.date}
                onChange={e => setNewOverride({...newOverride, date: e.target.value})}
                className="w-full p-3 bg-white border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
              />
            </div>
            <div className="flex-1">
              <label className="block font-body text-xs font-bold text-dark-charcoal mb-1 uppercase tracking-wider">Reason (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Vacation"
                value={newOverride.reason}
                onChange={e => setNewOverride({...newOverride, reason: e.target.value})}
                className="w-full p-3 bg-white border border-border-warm rounded-xl font-body text-sm text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-cta-yellow"
              />
            </div>
            <button
              onClick={addOverride}
              className="p-3 bg-cta-yellow text-oboe-black rounded-xl hover:bg-chip-yellow transition-colors font-bold flex items-center justify-center border border-oboe-black"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          {overrides.length > 0 ? (
            <div className="space-y-3">
              {overrides.map(override => (
                <div key={override.id} className="flex justify-between items-center p-4 bg-white border border-border-warm rounded-xl shadow-sm">
                  <div>
                    <h4 className="font-heading font-semibold text-oboe-black">
                      {new Date(override.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    {override.reason && <p className="font-body text-sm text-mid-gray-brown">{override.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeOverride(override.id)}
                    className="p-2 text-mid-gray-brown hover:text-red-600 transition-colors bg-surface-base rounded-lg"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-mid-gray-brown italic py-2">No overrides added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
