import { trpc } from '../utils/trpc';

export const PostListBox = () => {
  const { data: posts, isLoading } = trpc.useQuery(['posts.get-all-posts']);

  if (isLoading) {
    return <div>...</div>;
  }

  return (
    <div className="my-2">
      {posts?.map(({ id, postBody }) => (
        <li key={id}>{postBody}</li>
      ))}
    </div>
  );
};
