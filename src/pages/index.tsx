import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CenterErrorView from '../components/CenterErrorView';
import CenterSpinner from '../components/CenterSpinner';
import PlacementExperienceModal from '../components/PlacementExperienceModal';
import { PostListView } from '../components/PostListView';
import RegisterMobileNumberModal from '../components/RegisterMobileNumberModal';
import SetupForm from '../components/SetupForm';
import Toast from '../components/Toast';
import UpcomingTestsSection from '../components/UpcomingTestsSection';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data, status } = useSession();

  const {
    data: hasCompletedSetup,
    isLoading,
    isError,
  } = trpc.useQuery(['auth.has-completed-setup']);

  const [hasCompletedSetupLocal, setHasCompletedSetup] = useState<
    boolean | undefined
  >(hasCompletedSetup);

  const [selectedTab, setSelectedTab] = useState<'EXPERIENCES' | 'TESTS'>(
    'EXPERIENCES'
  );

  const [isPostCreationModalOpen, setPostCreationModal] =
    useState<boolean>(false);

  const [isRegisterMobileModalOpen, setRegisterMobiletModalOpen] =
    useState<boolean>(false);

  console.log(isRegisterMobileModalOpen);

  useEffect(() => {
    setHasCompletedSetup(hasCompletedSetup);
  }, [hasCompletedSetup]);

  if (status === 'loading' || isLoading) {
    return <CenterSpinner />;
  } else if (isError) {
    return <CenterErrorView />;
  } else if (status === 'unauthenticated') {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  const { name, image } = data?.user!;

  if (!hasCompletedSetupLocal) {
    return <SetupForm setCompleted={() => setHasCompletedSetup(true)} />;
  }

  return (
    <>
      <div className="drawer drawer-mobile">
        <input
          id="mass-recruiter-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          <div className="navbar flex justify-end bg-base-100 lg:hidden">
            <div className="flex-none">
              <label
                htmlFor="mass-recruiter-drawer"
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
              <PostListView openModal={() => setPostCreationModal(true)} />
            ) : (
              <UpcomingTestsSection
                openModal={() => setRegisterMobiletModalOpen(true)}
              />
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="mass-recruiter-drawer" className="drawer-overlay" />
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
        isOpen={isPostCreationModalOpen}
        closeModal={() => setPostCreationModal(false)}
      />
      <RegisterMobileNumberModal
        isOpen={isRegisterMobileModalOpen}
        closeModal={() => setRegisterMobiletModalOpen(false)}
      />
    </>
  );
};

export default Home;
