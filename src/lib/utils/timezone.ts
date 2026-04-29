export interface TimezoneOption {
  value: string;
  label: string;
}

export const TIMEZONES: TimezoneOption[] = [
  { value: "Pacific/Honolulu", label: "Hawaii (UTC-10)" },
  { value: "America/Anchorage", label: "Alaska (UTC-9)" },
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8)" },
  { value: "America/Denver", label: "Mountain Time (UTC-7)" },
  { value: "America/Chicago", label: "Central Time (UTC-6)" },
  { value: "America/New_York", label: "Eastern Time (UTC-5)" },
  { value: "America/Halifax", label: "Atlantic Time (UTC-4)" },
  { value: "America/Sao_Paulo", label: "Brazil Time (UTC-3)" },
  { value: "Atlantic/Azores", label: "Azores (UTC-1)" },
  { value: "UTC", label: "UTC (UTC+0)" },
  { value: "Europe/London", label: "London (UTC+0/+1)" },
  { value: "Europe/Paris", label: "Central European Time (UTC+1/+2)" },
  { value: "Europe/Helsinki", label: "Eastern European Time (UTC+2/+3)" },
  { value: "Europe/Moscow", label: "Moscow Time (UTC+3)" },
  { value: "Asia/Dubai", label: "Gulf Time (UTC+4)" },
  { value: "Asia/Karachi", label: "Pakistan Time (UTC+5)" },
  { value: "Asia/Kolkata", label: "India Time (UTC+5:30)" },
  { value: "Asia/Dhaka", label: "Bangladesh Time (UTC+6)" },
  { value: "Asia/Bangkok", label: "Indochina Time (UTC+7)" },
  { value: "Asia/Singapore", label: "Singapore Time (UTC+8)" },
  { value: "Asia/Tokyo", label: "Japan Time (UTC+9)" },
  { value: "Australia/Sydney", label: "Eastern Australia (UTC+10/+11)" },
  { value: "Pacific/Auckland", label: "New Zealand (UTC+12/+13)" },
];

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}
