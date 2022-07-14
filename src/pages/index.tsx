import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import UpcomingTestsSection from '../components/UpcomingTestsSection';

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<'EXPERIENCES' | 'TESTS'>(
    'EXPERIENCES'
  );
  const { data, status } = useSession();

  if (status === 'loading') {
    return <div>'...Loading'</div>;
  } else if (status === 'unauthenticated') {
    return (
      <div>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  const name = data?.user?.name;

  return (
    <>
      <Head>
        <title>PESU Placement Information Tool</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
          <div>
            {selectedTab === 'EXPERIENCES' ? (
              <>
                <h1 className="text-3xl text-center font-bold">
                  Welcome {name}!
                </h1>
                <button onClick={() => signOut()}>Sign Out</button>
              </>
            ) : (
              <UpcomingTestsSection />
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
            <li onClick={() => setSelectedTab('EXPERIENCES')}>
              <a>Placement Expiriences</a>
            </li>
            <li onClick={() => setSelectedTab('TESTS')}>
              <a>Upcoming Placement Tests</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
