export const TWO_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 2;

export const TWILIO_NUMBER = '+14155238886';

export const calculateDateTwoHoursAfterDate = () => {
  const currentTimeInMilliseconds = new Date().getTime();
  const timeAfterTwoHoursInMilliseconds =
    currentTimeInMilliseconds + TWO_HOURS_IN_MILLISECONDS;

  return new Date(timeAfterTwoHoursInMilliseconds);
};
