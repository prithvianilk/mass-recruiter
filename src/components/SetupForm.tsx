import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';

type FormData = {
  mobileNumber: string;
};

const SetupForm: React.FC<{ setCompleted: () => void }> = ({
  setCompleted,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate: updateMobileNumber } = trpc.useMutation(
    'auth.update-mobile-number'
  );

  const onSubmit = async ({ mobileNumber }: FormData) => {
    await updateMobileNumber(mobileNumber);
    setCompleted();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        className="form-control w-full max-w-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="label">
          <span className="label-text">What is your phone number?</span>
        </label>
        <input
          type="number"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          {...register('mobileNumber', {
            maxLength: 10,
            minLength: 10,
          })}
        />
        <label className="label">
          <span className="label-text-alt">
            Why are you taking this information?
          </span>
        </label>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
