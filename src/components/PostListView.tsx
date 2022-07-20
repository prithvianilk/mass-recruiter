import dynamic from 'next/dynamic';
import { trpc } from '../utils/trpc';
import CenterErrorView from './CenterErrorView';
import CenterSpinner from './CenterSpinner';

const MarkDownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

export const PostListView: React.FC<{ openModal: () => void }> = ({
  openModal,
}) => {
  const {
    data: posts,
    isLoading,
    isError,
  } = trpc.useQuery(['posts.get-all-posts']);

  if (isError) {
    return <CenterErrorView />;
  }

  if (isLoading) {
    return <CenterSpinner />;
  }

  return (
    <div className="w-2/3">
      <button className="btn" onClick={openModal}>
        open modal
      </button>
      <div className="mt-20">
        {posts?.map(({ id, title, body }) => (
          <div
            key={id}
            className="p-2 my-5 border border-solid border-neutral rounded"
          >
            <h3 className="text-2xl mb-3">{title}</h3>
            <MarkDownPreview className="p-6 rounded" source={body} />
          </div>
        ))}
      </div>
    </div>
  );
};
