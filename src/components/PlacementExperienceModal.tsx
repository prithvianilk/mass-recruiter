import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

const PlacementExperienceModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
}> = ({ isOpen, closeModal }) => {
  const { data } = useSession();

  const userId = data?.user?.id!;
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const { refetch } = trpc.useQuery(['posts.get-all-posts']);
  const { mutateAsync: createPost } = trpc.useMutation('posts.create-post');

  const onSubmit = async () => {
    await createPost({
      userId,
      title,
      body,
    });
    setTitle('');
    setBody('');
    refetch();
    closeModal();
  };

  return (
    <>
      <label className={`modal ${isOpen && 'modal-open'}`}>
        <div className="modal-box relative">
          <h3 className="font-bold text-lg">Share your Inverview Experience</h3>
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </label>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full max-w-xs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-30 h-30 my-2"
            placeholder="..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <button className="btn" onClick={onSubmit}>
              Post
            </button>
          </div>
        </div>
      </label>
    </>
  );
};

export default PlacementExperienceModal;
