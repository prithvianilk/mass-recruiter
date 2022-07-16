import twilio, { Twilio } from 'twilio';

declare global {
  var twilioClient: Twilio | undefined;
}

export const twilioClient =
  global.twilioClient ||
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

if (process.env.NODE_ENV !== 'production') {
  global.twilioClient = twilioClient;
}
