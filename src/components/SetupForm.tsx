import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { AiFillInfoCircle } from 'react-icons/ai';

type FormData = {
  mobileNumber: string | null;
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
        className="form-control w-full max-w-xs grid gap-1"
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
          <div className="label-text-alt w-full flex justify-between items-center">
            <div className="flex">
              Why are you taking this information?
              <span className="ml-2 text-lg">
                <div
                  className="tooltip flex items-center"
                  data-tip="We need your mobile number to send Whatsapp notifications before tests and registration link expiry."
                >
                  <AiFillInfoCircle />
                </div>
              </span>
            </div>
            <button
              onClick={() => onSubmit({ mobileNumber: null })}
              className="btn btn-secondary btn-ghost btn-sm"
            >
              Skip
            </button>
          </div>
        </label>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
