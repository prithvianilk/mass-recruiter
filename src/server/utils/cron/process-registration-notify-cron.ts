import { prettifyDate } from '../../../utils/date';
import { prisma } from '../../db/client';
import { twilioClient } from '../../twilio/client';
import { logger } from '../logger';
import { calculateDateTwoHoursAfterDate, TWILIO_NUMBER } from './common';

export const processRegistrationNotificationCron = async () => {
  const twoHoursAfterDeadline = calculateDateTwoHoursAfterDate();

  const notifyEvents =
    await prisma.placementEventUserRegistrationNotification.findMany({
      where: {
        PlacementEvent: {
          registrationDeadline: {
            lte: twoHoursAfterDeadline,
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
            registrationDeadline: true,
            registratonLink: true,
          },
        },
      },
    });

  logger?.info('Notifications being sent: ', notifyEvents);

  await Promise.all(
    notifyEvents.map(
      ({
        PlacementEvent: { companyName, registrationDeadline, registratonLink },
        User: { mobileNumber },
      }) => {
        twilioClient.messages.create({
          body: `${companyName}'s registration link is expiring at ${prettifyDate(
            registrationDeadline
          )}. Please register at ${registratonLink} now.`,
          from: `whatsapp:${TWILIO_NUMBER}`,
          to: `whatsapp:+91${mobileNumber}`,
        });
      }
    )
  );

  const notifyEventIds = notifyEvents.map(({ id }) => id);

  await prisma.placementEventUserRegistrationNotification.deleteMany({
    where: {
      id: { in: notifyEventIds },
    },
  });

  logger?.info('Cron successfully processed!');
};