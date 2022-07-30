import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import CenterSpinner from '../components/CenterSpinner';
import PlacementExperienceModal from '../components/PlacementExperienceModal';
import { PostListView } from '../components/PostListView';
import SetupForm from '../components/SetupForm';
import Toast from '../components/Toast';
import UpcomingTestsSection from '../components/UpcomingTestsSection';

const Home: NextPage = () => {
  const { data, status } = useSession();

  const [selectedTab, setSelectedTab] = useState<'EXPERIENCES' | 'TESTS'>(
    'EXPERIENCES'
  );

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  if (status === 'loading') {
    return <CenterSpinner />;
  } else if (status === 'unauthenticated') {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  const { name, image, hasCompletedSetup } = data?.user!;

  if (!hasCompletedSetup) {
    return <SetupForm />;
  }

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="navbar flex justify-end bg-base-100 lg:hidden">
            <div className="flex-none">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-square btn-ghost drawer-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
          <div className="flex justify-center">
            {selectedTab === 'EXPERIENCES' ? (
              <PostListView openModal={() => setModalOpen(true)} />
            ) : (
              <UpcomingTestsSection />
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay" />
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
            <div className="flex justify-evenly items-center">
              <h1 className="text-2xl text-center font-bold flex justify-center flex-col">
                {name}
              </h1>
              <div className="avatar">
                <div className="w-10">
                  <Image
                    layout="fill"
                    className="rounded-full"
                    src={image!}
                    alt="profile-picture"
                  />
                </div>
              </div>
            </div>
            <li className="mt-3" onClick={() => setSelectedTab('EXPERIENCES')}>
              <a>Placement Experiences</a>
            </li>
            <li onClick={() => setSelectedTab('TESTS')}>
              <a>Upcoming Placement Tests</a>
            </li>
            <li onClick={() => signOut()}>
              <button>Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
      <Toast />
      <PlacementExperienceModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
      />
    </>
  );
};

export default Home;
