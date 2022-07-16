import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';
import { twilioClient } from '../../../server/twilio/client';

const TWO_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 2;

export default async function TwoHourNotifyCron(
  _: NextApiRequest,
  res: NextApiResponse
) {
  const postDeadlineTime = new Date(Date.now() + TWO_HOURS_IN_MILLISECONDS);

  const notifyEvents = await prisma.placementEvent2UserNotify.findMany({
    where: {
      PlacementEvent: {
        deadlineOfRegistration: {
          lte: postDeadlineTime,
        },
        is2hReminderSent: false,
      },
    },
    select: {
      User: {
        select: {
          mobileNumber: true,
        },
      },
      PlacementEvent: {
        select: {
          id: true,
          companyName: true,
          deadlineOfRegistration: true,
          registratonLink: true,
        },
      },
    },
  });

  await Promise.all(
    notifyEvents.map(
      ({
        PlacementEvent: {
          companyName,
          deadlineOfRegistration,
          registratonLink,
        },
        User: { mobileNumber },
      }) => {
        twilioClient.messages.create({
          body: `${companyName}'s registration link is expiring at ${deadlineOfRegistration}. Please register at ${registratonLink} now.`,
          from: 'whatsapp:+14155238886',
          to: `whatsapp:+91${mobileNumber}`,
        });
      }
    )
  );

  const placementEventIds = notifyEvents.map(
    ({ PlacementEvent: { id } }) => id
  );

  await prisma.placementEvent.updateMany({
    where: {
      id: { in: placementEventIds },
    },
    data: {
      is2hReminderSent: true,
    },
  });

  res.status(200);
  res.json({
    message: 'Cron was succesfully processed!',
  });
}
