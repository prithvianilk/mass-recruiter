import { trpc } from '../utils/trpc';
import CenterSpinner from './CenterSpinner';
import PostEditTextBox from './PostEditTextBox';

export const PostListView = () => {
  const { data: posts, isLoading } = trpc.useQuery(['posts.get-all-posts']);

  if (isLoading) {
    return <CenterSpinner />;
  }

  return (
    <div className="mt-20">
      <PostEditTextBox />
      <div className="my-2">
        {posts?.map(({ id, postBody }) => (
          <li key={id}>{postBody}</li>
        ))}
      </div>
    </div>
  );
};
