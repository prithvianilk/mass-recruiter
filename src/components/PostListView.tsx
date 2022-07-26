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
    <div className="w-11/12 md:w-2/3 mt-6">
      <button className="btn w-full" onClick={openModal}>
        Open Modal
      </button>
      <div>
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
