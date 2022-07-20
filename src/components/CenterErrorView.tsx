const CenterErrorView: React.FC = () => (
  <div className="w-full h-screen flex justify-center items-center">
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <p className="text-2xl py-6">
            We are facing a temporary issue.
            <br />
            Please try again later.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CenterErrorView;
