import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CenterSpinner from '../components/CenterSpinner';
import SetupForm from '../components/SetupForm';

const RegisterMobileNumber: React.FC = () => {
  const router = useRouter();

  const { status } = useSession();

  if (status === 'loading') {
    return <CenterSpinner />;
  }

  return <SetupForm setCompleted={() => router.push('/')} />;
};

export default RegisterMobileNumber;
