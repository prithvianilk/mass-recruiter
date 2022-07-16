import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';
import { twilioClient } from '../../../server/twilio/client';

const TWO_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 2;

export default async function TwoHourNotifyCron(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const postDeadlineTime = new Date(Date.now() + TWO_HOURS_IN_MILLISECONDS);

  const notifyEvents = await prisma.placementEventUserNotification.findMany({
    where: {
      PlacementEvent: {
        registrationDeadline: {
          lte: postDeadlineTime,
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

  await Promise.all(
    notifyEvents.map(
      ({
        PlacementEvent: { companyName, registrationDeadline, registratonLink },
        User: { mobileNumber },
      }) => {
        twilioClient.messages.create({
          body: `${companyName}'s registration link is expiring at ${registrationDeadline}. Please register at ${registratonLink} now.`,
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

  res.status(200);
  res.json({
    message: 'Cron was succesfully processed!',
  });
}
