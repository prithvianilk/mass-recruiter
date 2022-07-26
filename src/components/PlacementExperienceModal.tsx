import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

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
        <div className="modal-box w-11/12 max-w-5xl relative">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">
              Share your Interview Experience
            </h3>
            <label className="btn btn-sm btn-circle" onClick={closeModal}>
              ✕
            </label>
          </div>
          <div className="py-5 w-full">
            <input
              type="text"
              placeholder="Title"
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Editor
            placeholder="..."
            value={body}
            onChange={(value) => setBody(value!)}
          />
          <div className="py-5 flex justify-end">
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
