/**
 * Timezone utilities for West Africa Time (WAT / Africa/Lagos) and student local time
 */

export function getUserLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
  } catch {
    return "Africa/Lagos";
  }
}

export function formatDualTime(dateStr: string, timeStr: string, userTimeZone?: string): {
  watFormatted: string;
  localFormatted: string;
  isDifferent: boolean;
} {
  const localTz = userTimeZone || getUserLocalTimeZone();
  const watTz = "Africa/Lagos";

  try {
    // Parse the date and time as Lagos/WAT
    // e.g. "2026-08-12", "14:00"
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Create date representation in UTC
    const targetDate = new Date(Date.UTC(year, month - 1, day, hours - 1, minutes)); // WAT is UTC+1

    const watFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: watTz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const localFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: localTz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    const watFormatted = `${watFormatter.format(targetDate)} WAT`;
    const localFormatted = localFormatter.format(targetDate);
    const isDifferent = localTz !== watTz;

    return {
      watFormatted,
      localFormatted,
      isDifferent,
    };
  } catch (error) {
    return {
      watFormatted: `${timeStr} WAT`,
      localFormatted: `${timeStr} Local`,
      isDifferent: false,
    };
  }
}
