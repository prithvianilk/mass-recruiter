import Link from 'next/link';

const RegisterMobileNumberModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
}> = ({ isOpen, closeModal }) => {
  return (
    <>
      <input
        id="register-mobile-number-modal"
        onClick={closeModal}
        type="checkbox"
        className={`${!isOpen && 'hidden'}`}
      />
      <label
        htmlFor="register-mobile-number-modal"
        className={`modal ${isOpen && 'modal-open'} cursor-pointer`}
      >
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
            You have not registered your mobile number!
          </h3>
          <p className="py-4">
            To register your mobile number,{' '}
            <a className="link link-primary">
              <Link href="/register-mobile-number">click here</Link>
            </a>
          </p>
        </label>
      </label>
    </>
  );
};

export default RegisterMobileNumberModal;
