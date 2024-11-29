export function formatDateToCustomString(date: Date, hhmmss = '00:00:00'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T${hhmmss}`;
}


export function getDayOfWeek(date: Date, abbreviation = true): string {
  const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  return abbreviation ? dayAbbreviations[date.getDay()] : daysOfWeek[date.getDay()]; // Map getDay() result to the weekday name
}



export function addMinutesToDate(date: Date, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}


export function getTimeFromDate(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2-digit format
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2-digit format
  return `${hours}:${minutes}`;
}

export function compareDates(arg1: Date | string, arg2: Date | string): boolean {
  const date1 = new Date(arg1);
  const date2 = new Date(arg2);
  // Extract year, month, and day parts from both dates
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  // Compare year, month, and day
  return year1 === year2 && month1 === month2 && day1 === day2;
}
