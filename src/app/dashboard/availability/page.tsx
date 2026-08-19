"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import HugeIcon from "@/components/ui/HugeIcon";

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

  if (authLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center font-body text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span>Loading availability...</span>
        </div>
      </div>
    );
  }

  if (userData?.role !== "tutor") {
    return (
      <div className="min-h-[300px] flex items-center justify-center font-body text-text-secondary">
        <span>Unauthorized access.</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-light">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Availability</h1>
          <p className="font-body text-xs md:text-sm text-text-secondary mt-1">Manage your weekly working hours and lesson time slots.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.info("Google Calendar sync will be added soon!")}
            className="px-5 py-2.5 bg-white border border-border-light text-text-primary rounded-full font-body text-xs font-semibold flex items-center gap-2 hover:bg-surface-muted transition-colors"
          >
            <HugeIcon name="calendar" size={16} className="text-accent-blue" />
            <span>Sync Calendar</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-border-light shadow-xs mb-8">
        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-6">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-xl border border-accent-blue/20 flex items-center justify-center text-accent-blue">
            <HugeIcon name="clock" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text-primary">Weekly Hours</h3>
            <p className="font-body text-xs text-text-secondary">These hours dictate when students can book lessons with you.</p>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl">
          {DAYS.map(day => (
            <div key={day.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-2 border-b border-border-light/60 last:border-0 pb-6 last:pb-0">
              
              <div className="w-40 flex items-center gap-3">
                <button
                  onClick={() => toggleDay(day.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative ${schedule[day.id].active ? 'bg-accent-blue' : 'bg-surface-muted border border-border-light'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform ${schedule[day.id].active ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`font-body text-xs font-bold ${schedule[day.id].active ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {day.label}
                </span>
              </div>

              {schedule[day.id].active ? (
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    type="time" 
                    value={schedule[day.id].startTime}
                    onChange={(e) => updateTime(day.id, "startTime", e.target.value)}
                    className="px-3 py-2 bg-surface-near-white border border-border-light rounded-xl font-body text-xs text-text-primary focus:outline-none focus:border-accent-blue"
                  />
                  <span className="text-xs text-text-secondary font-medium">to</span>
                  <input 
                    type="time" 
                    value={schedule[day.id].endTime}
                    onChange={(e) => updateTime(day.id, "endTime", e.target.value)}
                    className="px-3 py-2 bg-surface-near-white border border-border-light rounded-xl font-body text-xs text-text-primary focus:outline-none focus:border-accent-blue"
                  />
                </div>
              ) : (
                <div className="flex-1 text-text-subtle font-body italic text-xs py-2">
                  Unavailable
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-border-light shadow-xs">
        <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-6">
          <div className="w-10 h-10 bg-surface-muted rounded-xl border border-border-light flex items-center justify-center text-text-primary">
            <HugeIcon name="calendar" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text-primary">Date Overrides</h3>
            <p className="font-body text-xs text-text-secondary">Block off specific dates for holidays or personal time off.</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6 p-4 bg-surface-near-white rounded-2xl border border-border-light">
            <div className="flex-1">
              <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Date</label>
              <input 
                type="date"
                value={newOverride.date}
                onChange={e => setNewOverride({...newOverride, date: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-border-light rounded-xl font-body text-xs text-text-primary focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div className="flex-1">
              <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">Reason (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Vacation"
                value={newOverride.reason}
                onChange={e => setNewOverride({...newOverride, reason: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-border-light rounded-xl font-body text-xs text-text-primary focus:outline-none focus:border-accent-blue"
              />
            </div>
            <button
              onClick={addOverride}
              className="px-4 py-2 bg-text-primary text-white rounded-xl hover:bg-black transition-colors text-xs font-semibold flex items-center justify-center"
            >
              <span>+ Add</span>
            </button>
          </div>

          {overrides.length > 0 ? (
            <div className="space-y-3">
              {overrides.map(override => (
                <div key={override.id} className="flex justify-between items-center p-4 bg-surface-near-white border border-border-light rounded-2xl">
                  <div>
                    <h4 className="font-heading font-bold text-xs text-text-primary">
                      {new Date(override.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    {override.reason && <p className="font-body text-[11px] text-text-secondary mt-0.5">{override.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeOverride(override.id)}
                    className="p-2 text-text-secondary hover:text-red-600 transition-colors bg-white rounded-lg border border-border-light"
                  >
                    <HugeIcon name="cancel" size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-xs text-text-subtle italic py-2">No overrides added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
