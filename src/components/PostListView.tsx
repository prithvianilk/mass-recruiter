import { trpc } from '../utils/trpc';
import CenterSpinner from './CenterSpinner';

export const PostListView: React.FC<{ openModal: () => void }> = ({
  openModal,
}) => {
  const { data: posts, isLoading } = trpc.useQuery(['posts.get-all-posts']);

  if (isLoading) {
    return <CenterSpinner />;
  }

  return (
    <>
      <button className="btn" onClick={openModal}>
        open modal
      </button>
      <div className="mt-20">
        {posts?.map(({ id, postBody }) => (
          <li key={id}>{postBody}</li>
        ))}
      </div>
    </>
  );
};
