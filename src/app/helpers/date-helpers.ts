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