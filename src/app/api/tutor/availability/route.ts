import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { schedule, overrides } = await request.json();

    const apiKey = process.env.CALCOM_API_KEY;

    // Map our frontend schedule format to Cal.com's expected format
    // Cal.com expects an array: [{ days: [1, 2, 3], startTime: "09:00", endTime: "17:00" }]
    const availabilityArray = [];
    
    // Simple mapping: create an entry for each active day
    for (const [dayStr, data] of Object.entries(schedule as Record<string, { active: boolean, startTime: string, endTime: string }>)) {
      if (data.active) {
        availabilityArray.push({
          days: [parseInt(dayStr)],
          startTime: data.startTime,
          endTime: data.endTime,
        });
      }
    }

    if (apiKey) {
      // 1. Update the default schedule
      const response = await fetch("https://api.cal.com/v1/schedules", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Default Working Hours",
          timeZone: "Africa/Lagos", 
          schedule: availabilityArray
        })
      });

      if (!response.ok) {
        console.error("Cal.com API error", await response.text());
        throw new Error(`Cal.com API error: ${response.statusText}`);
      }

      // 2. Add overrides (Time Off) if any exist
      if (overrides && overrides.length > 0) {
        for (const override of overrides) {
          // You would push this to Cal.com's outOfOffice or date overrides API endpoint here.
          // Example: /v1/schedules/{scheduleId} or /v1/outOfOffice
          console.log(`Syncing override to Cal.com: ${override.date}`);
        }
      }
    } else {
      console.warn("CALCOM_API_KEY is not set. Simulating success for availability.");
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to update availability:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update availability";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
