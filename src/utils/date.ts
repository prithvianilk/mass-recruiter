export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];


export const prettifyDate = (date: Date) => {
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  let timeSub = 'PM';
  const dayString = days[date.getDay()]?.slice(0, 3);
  const monthString = monthNames[date.getMonth()]?.slice(0, 3);
  if (hours < 12) {
    timeSub = 'AM';
  } else {
    if (hours != 12) {
      hours -= 12;
    }
  }
  let subscript = 'th';
  if (day === 1) {
    subscript = 'st';
  } else if (day === 2) {
    subscript = 'nd';
  } else if (day === 3) {
    subscript = 'rd';
  }
  return `${day}${subscript} ${monthString} (${dayString}) @ ${hours}:${minutes} ${timeSub}`;
};
