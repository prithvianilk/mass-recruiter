import { NextApiRequest, NextApiResponse } from 'next';
import { processTestNotificationCron } from '../../../server/utils/cron/process-test-notify-cron';
import { logger } from '../../../server/utils/logger';

export default async function TwoHourNotifyForTestCron(
  _: NextApiRequest,
  res: NextApiResponse
) {
  try {
    logger?.info('Received test notification cron request');

    await processTestNotificationCron();

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
