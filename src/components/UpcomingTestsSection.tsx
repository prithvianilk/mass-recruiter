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
    <ul className="md:w-2/3 w-5/6">
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
                <div>
                  Registration Deadline: {prettifyDate(deadlineOfRegistration)}
                </div>
                <div>Test Date: {prettifyDate(testTime)}</div>
              </div>
              <button className="flex justify-evenly w-1/6 text-yellow-300">
                <div className="tooltip" data-tip="I have registered!">
                  <input
                    type="checkbox"
                    checked={true}
                    className="checkbox checkbox-accent"
                  />
                </div>
                <div className="tooltip" data-tip="Notify me before the test">
                  <TbBellRinging size={25} />
                </div>
              </button>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default UpcomingTestsSection;
