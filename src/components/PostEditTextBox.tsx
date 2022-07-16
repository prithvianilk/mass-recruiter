import { useState } from 'react';
import { trpc } from '../utils/trpc';

const PostEditTextBox: React.FC<{ userID: string }> = ({ userID }) => {
  const [text, setText] = useState<string>('');

  const { mutate: createPost } = trpc.useMutation('posts.create-post');

  const onSubmit = () => {
    createPost({
      userID,
      postBody: text,
    });
  };

  return (
    <div className="flex flex-col">
      <textarea
        className="textarea textarea-bordered w-30 h-30 my-2"
        placeholder="..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn btn-primary" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default PostEditTextBox;
