import { NextApiRequest, NextApiResponse } from 'next';
import { processRegistrationNotificationCron } from '../../../server/utils/cron/process-registration-notify-cron';
import { logger } from '../../../server/utils/logger';

export default async function TwoHourNotifyForRegistrationCron(
  _: NextApiRequest,
  res: NextApiResponse
) {
  try {
    logger?.info('Received registration notification cron request');

    await processRegistrationNotificationCron();

    logger?.info('Cron successfully processed!');

    res.status(200).json({
      message: 'Cron was succesfully processed!',
    });
  } catch (err) {
    logger?.error(err);
    res.status(500).json({
      message: 'Error while processing cron' + err,
    });
  }
}
