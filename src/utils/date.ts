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

export const getMessageDate = (date: Date) => {
  const dateInIndianTimeZone = convertToIndianTimeZone(date);
  return prettifyDate(dateInIndianTimeZone);
};

export const convertToIndianTimeZone = (date: Date) => {
  return new Date(
    date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    })
  );
};

export const prettifyDate = (date: Date) => {
  const day = date.getDate();

  const lastDigitOfDay = day % 10;
  const firstDigitOfDayIsOne = Math.floor(day / 10) === 1;
  let subscript = 'th';
  if (!firstDigitOfDayIsOne && lastDigitOfDay === 1) {
    subscript = 'st';
  } else if (!firstDigitOfDayIsOne && lastDigitOfDay === 2) {
    subscript = 'nd';
  } else if (!firstDigitOfDayIsOne && lastDigitOfDay === 3) {
    subscript = 'rd';
  }

  const monthString = monthNames[date.getMonth()]?.slice(0, 3);
  const dayString = days[date.getDay()]?.slice(0, 3);
  let hours = date.getHours();

  let minutes = date.getMinutes().toString();
  if (minutes === '0') {
    minutes = '00';
  }

  let timeSub = 'PM';
  if (hours < 12) {
    if (hours === 0) {
      hours = 12;
    }
    timeSub = 'AM';
  } else if (hours != 12) {
    hours -= 12;
  }

  return `${day}${subscript} ${monthString} (${dayString}) @ ${hours}:${minutes} ${timeSub}`;
};
