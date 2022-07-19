import { PlacementEvent } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { TbBellOff, TbBellRinging } from 'react-icons/tb';
import { prettifyDate } from '../utils/date';
import useStore from '../utils/store';
import { trpc } from '../utils/trpc';

type PlacementEventCardProps = PlacementEvent & {
  hasRegistered: boolean;
  wantsNotification: boolean;
  onToggleRegistration: (
    eventId: string,
    hasRegistered: boolean,
    type: 'REGISTER' | 'NOTIFY',
    setDisabled: (state: boolean) => void,
    toggleState: () => void
  ) => Promise<void>;
  onToggleNotification: (
    eventId: string,
    hasRegistered: boolean,
    type: 'REGISTER' | 'NOTIFY',
    setDisabled: (state: boolean) => void,
    toggleState: () => void
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

  const { remove, add } = useStore();

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
                  'REGISTER',
                  setRegistrationDisabled,
                  () => {
                    add(
                      <div key={`${id}-register-toast`} className="alert">
                        Marked{' '}
                        {!localHasRegistered ? 'registered' : 'unregistered'}{' '}
                        for {companyName}
                      </div>
                    );
                    setLocalHasRegistered(!localHasRegistered);
                    setTimeout(remove, 3000);
                  }
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
                    'NOTIFY',
                    setNotificationDisabled,
                    () => {
                      setLocalWantsNotification(!localWantsNotification);
                      add(
                        <div key={`${id}-notify-toast`} className="alert">
                          {localWantsNotification ? 'Removed' : 'Added'}{' '}
                          Notification for {companyName}
                        </div>
                      );
                      setTimeout(remove, 3000);
                    }
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

  const onToggle = async (
    eventId: string,
    state: boolean,
    type: 'REGISTER' | 'NOTIFY',
    setDisabled: (state: boolean) => void,
    toggleState: () => void
  ) => {
    setDisabled(true);
    if (type === 'NOTIFY') {
      if (!state) {
        await notifyEvent({ eventId, userId });
      } else {
        await unnotifyEvent({ eventId, userId });
      }
    } else {
      if (state) {
        await deleteRegistration({ eventId, userId });
      } else {
        await confirmRegistration({ eventId, userId });
      }
    }
    setDisabled(false);
    toggleState();
  };

  return (
    <ul className="md:w-2/3 w-5/6">
      {placementEvents?.map((event) => (
        <PlacementEventCard
          key={event.id}
          {...event}
          onToggleRegistration={onToggle}
          onToggleNotification={onToggle}
        />
      ))}
    </ul>
  );
};

export default UpcomingTestsSection;
