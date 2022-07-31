import { getMessageDate } from '../../../utils/date';
import { prisma } from '../../db/client';
import { twilioClient } from '../../twilio/client';
import { logger } from '../logger';
import { calculateDateTwoHoursAfterDate, TWILIO_NUMBER } from './common';

export const processTestNotificationCron = async () => {
  logger?.info('Test notification cron request received.');

  const twoHoursAfterDeadline = calculateDateTwoHoursAfterDate();

  const notifyEvents = await prisma.placementEventUserTestNotification.findMany(
    {
      where: {
        PlacementEvent: {
          testTime: {
            lte: twoHoursAfterDeadline,
          },
        },
        User: { mobileNumber: { not: null } },
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
    }
  );

  logger?.info('Notifications being sent: ', notifyEvents);

  await Promise.all(
    notifyEvents.map(
      ({
        PlacementEvent: { companyName, testTime },
        User: { mobileNumber },
      }) => {
        const messageDate = getMessageDate(testTime);
        twilioClient.messages.create({
          body: `${companyName}'s test is starting at ${messageDate}. All the best!`,
          from: `whatsapp:${TWILIO_NUMBER}`,
          to: `whatsapp:+91${mobileNumber}`,
        });
      }
    )
  );

  const notifyEventIds = notifyEvents.map(({ id }) => id);

  await prisma.placementEventUserTestNotification.deleteMany({
    where: {
      id: { in: notifyEventIds },
    },
  });
};
