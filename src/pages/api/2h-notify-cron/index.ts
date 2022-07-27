import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';
import { twilioClient } from '../../../server/twilio/client';
import { logger } from '../../../server/utils/logger';
import { prettifyDate } from '../../../utils/date';

const TWO_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 2;

export default async function TwoHourNotifyCron(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const postDeadline = new Date(
    new Date().getTime() + TWO_HOURS_IN_MILLISECONDS
  );

  logger?.info('Received cron request');

  const notifyEvents = await prisma.placementEventUserNotification.findMany({
    where: {
      PlacementEvent: {
        testTime: {
          lte: postDeadline,
        },
      },
    },
    select: {
      id: true,
      User: {
        select: {
          mobileNumber: true,
        },
      },
      PlacementEvent: {
        select: {
          id: true,
          companyName: true,
          testTime: true,
        },
      },
    },
  });

  logger?.info('Notifications being sent: ', notifyEvents);

  await Promise.all(
    notifyEvents.map(
      ({
        PlacementEvent: { companyName, testTime },
        User: { mobileNumber },
      }) => {
        twilioClient.messages.create({
          body: `${companyName}'s test is starting at ${prettifyDate(
            testTime
          )}. All the best!!`,
          from: 'whatsapp:+14155238886',
          to: `whatsapp:+91${mobileNumber}`,
        });
      }
    )
  );

  const notifyEventIds = notifyEvents.map(({ id }) => id);

  await prisma.placementEventUserNotification.deleteMany({
    where: {
      id: { in: notifyEventIds },
    },
  });

  logger?.info('Cron successfully processed!');

  res.status(200);
  res.json({
    message: 'Cron was succesfully processed!',
  });
}
