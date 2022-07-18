import { PlacementEvent, Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { TbBellRinging } from 'react-icons/tb';
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
}) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [localHasRegistered, setLocalHasRegistered] =
    useState<boolean>(hasRegistered);

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
                  setDisabled,
                  setLocalHasRegistered
                );
              }}
              className="checkbox checkbox-accent"
              disabled={isDisabled}
              checked={localHasRegistered}
            />
          </div>
          <div className="tooltip" data-tip="Notify me before the test">
            <TbBellRinging size={25} />
          </div>
        </button>
      </div>
    </li>
  );
};

const UpcomingTestsSection = () => {
  const { data } = useSession();

  const userId = data?.user?.id!;

  const { mutate: notifyEvent } = trpc.useMutation('placement.notify-event');

  const { mutate: unnotifyEvent } = trpc.useMutation(
    'placement.unnotify-event'
  );

  const { mutateAsync: confirmRegistration } = trpc.useMutation(
    'placement.confirm-registration'
  );

  const { mutateAsync: deleteRegistration } = trpc.useMutation(
    'placement.delete-registration'
  );

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

  const { data: placementEvents, isLoading } = trpc.useQuery([
    'placement.get-placement-upcoming-events',
  ]);

  if (isLoading) {
    return <div>...</div>;
  }

  return (
    <ul className="md:w-2/3 w-5/6">
      {placementEvents?.map((event) => (
        <PlacementEventCard
          key={event.id}
          {...event}
          onToggleRegistration={onToggleRegistration}
        />
      ))}
    </ul>
  );
};

export default UpcomingTestsSection;
