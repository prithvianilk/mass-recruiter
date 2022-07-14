import { PlacementEvent } from '@prisma/client';
import { TbBellRinging } from 'react-icons/tb';
import { monthNames } from '../utils/date';

type UpcomingTestsSectionProps = {
  placementEvents: PlacementEvent[] | undefined;
};

const prettifyDate = (date: Date) => {
  const day = date.getDate();
  let subscript = 'th';
  if (day === 1) {
    subscript = 'st';
  } else if (day === 2) {
    subscript = 'nd';
  } else if (day === 3) {
    subscript = 'rd';
  }
  //TODO: 9PM 1st Jan (Wed)
  return `${day}${subscript} ${monthNames[date.getMonth()]}`;
};

const UpcomingTestsSection: React.FC<UpcomingTestsSectionProps> = ({
  placementEvents,
}) => {
  return (
    <ul className="w-2/3">
      {placementEvents?.map(
        ({
          companyName,
          deadlineOfRegistration,
          id,
          registratonLink,
          testTime,
        }) => (
          <li
            key={id}
            className="p-4 card-bordered border-secondary rounded my-5"
          >
            <div className="flex justify-between">
              <h1 className="text-2xl">{companyName}</h1>
              <a
                className="link link-hover text-secondary flex flex-col justify-center"
                href={registratonLink}
              >
                Link to form
              </a>
            </div>
            <div className="divider" />
            <div className="flex justify-between">
              <div>
                <div>
                  Registration Deadline: {prettifyDate(deadlineOfRegistration)}
                </div>
                <div>Test Date: {prettifyDate(testTime)}</div>
              </div>
              <button className="flex justify-center flex-col mr-8 text-yellow-300">
                <TbBellRinging size={25} />
              </button>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default UpcomingTestsSection;
