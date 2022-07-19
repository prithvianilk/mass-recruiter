import useStore from '../utils/store';

const Toast: React.FC = () => {
  const toasts = useStore((s) => s.toasts);

  return (
    <div className="toast toast-end">
      {toasts.map((T, index) => (
        <div key={index}>{T}</div>
      ))}
    </div>
  );
};

export default Toast;
