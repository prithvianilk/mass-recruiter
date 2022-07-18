import { PlacementEvent } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { TbBellOff, TbBellRinging } from 'react-icons/tb';
import { prettifyDate } from '../utils/date';
import { trpc } from '../utils/trpc';

type PlacementEventCardProps = PlacementEvent & {
  hasRegistered: boolean;
  wantsNotification: boolean;
  onToggleRegistration: (
    eventId: string,
    hasRegistered: boolean,
    setDisabled: (state: boolean) => void,
    setLocalHasRegistered: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
  onToggleNotification: (
    eventId: string,
    hasRegistered: boolean,
    setDisabled: (state: boolean) => void,
    setLocalHasRegistered: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
};

const PlacementEventCard: React.FC<PlacementEventCardProps> = ({
  id,
  companyName,
  hasRegistered,
  registrationDeadline,
  registratonLink,
  testTime,
  wantsNotification,
  onToggleRegistration,
  onToggleNotification,
}) => {
  const [isRegistrationDisabled, setRegistrationDisabled] =
    useState<boolean>(false);

  const [isNotificationDisabled, setNotificationDisabled] =
    useState<boolean>(false);

  const [localHasRegistered, setLocalHasRegistered] =
    useState<boolean>(hasRegistered);

  const [localWantsNotification, setLocalWantsNotification] =
    useState<boolean>(wantsNotification);

  return (
    <li className="p-4 card-bordered border-secondary rounded my-5">
      <div className="flex justify-between">
        <h1 className="text-2xl">{companyName}</h1>
        <a
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-secondary flex flex-col justify-center"
          href={registratonLink}
        >
          Link to form
        </a>
      </div>
      <div className="divider" />
      <div className="flex justify-between">
        <div>
          <div>Registration Deadline: {prettifyDate(registrationDeadline)}</div>
          <div>Test Date: {prettifyDate(testTime)}</div>
        </div>
        <button className="flex justify-evenly w-1/6 text-yellow-300">
          <div className="tooltip" data-tip="Click to confirm registration">
            <input
              type="checkbox"
              onChange={() => {
                onToggleRegistration(
                  id,
                  localHasRegistered,
                  setRegistrationDisabled,
                  setLocalHasRegistered
                );
              }}
              className="checkbox checkbox-accent"
              disabled={isRegistrationDisabled}
              checked={localHasRegistered}
            />
          </div>
          <div className="tooltip" data-tip="Notify me before the test">
            <div
              aria-disabled={isNotificationDisabled}
              onClick={() => {
                if (!isNotificationDisabled) {
                  onToggleNotification(
                    id,
                    localWantsNotification,
                    setNotificationDisabled,
                    setLocalWantsNotification
                  );
                }
              }}
            >
              {localWantsNotification ? (
                <TbBellRinging size={25} />
              ) : (
                <TbBellOff size={25} />
              )}
            </div>
          </div>
        </button>
      </div>
    </li>
  );
};

const UpcomingTestsSection = () => {
  const { data } = useSession();

  const userId = data?.user?.id!;

  const { mutateAsync: notifyEvent } = trpc.useMutation(
    'placement.notify-event'
  );

  const { mutateAsync: unnotifyEvent } = trpc.useMutation(
    'placement.unnotify-event'
  );

  const { mutateAsync: confirmRegistration } = trpc.useMutation(
    'placement.confirm-registration'
  );

  const { mutateAsync: deleteRegistration } = trpc.useMutation(
    'placement.delete-registration'
  );

  const { data: placementEvents, isLoading } = trpc.useQuery([
    'placement.get-placement-upcoming-events',
  ]);

  if (isLoading) {
    return <div>...</div>;
  }

  const onToggleRegistration = async (
    eventId: string,
    hasRegistered: boolean,
    setDisabled: (state: boolean) => void,
    setLocalHasRegistered: Dispatch<SetStateAction<boolean>>
  ) => {
    setDisabled(true);
    if (hasRegistered) {
      await deleteRegistration({ eventId, userId });
    } else {
      await confirmRegistration({ eventId, userId });
    }
    setDisabled(false);
    setLocalHasRegistered(!hasRegistered);
  };

  const onToggleNotification = async (
    eventId: string,
    wantsNotification: boolean,
    setDisabled: (state: boolean) => void,
    setLocalWantsNotification: Dispatch<SetStateAction<boolean>>
  ) => {
    setDisabled(true);
    if (!wantsNotification) {
      await notifyEvent({ eventId, userId });
    } else {
      await unnotifyEvent({ eventId, userId });
    }
    setDisabled(false);
    setLocalWantsNotification(!wantsNotification);
  };

  return (
    <ul className="md:w-2/3 w-5/6">
      {placementEvents?.map((event) => (
        <PlacementEventCard
          key={event.id}
          {...event}
          onToggleRegistration={onToggleRegistration}
          onToggleNotification={onToggleNotification}
        />
      ))}
    </ul>
  );
};

export default UpcomingTestsSection;
