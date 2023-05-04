// pages/[postId].js

function PostPage({ postId }) {
  return (
    <div>
      <h1>Post {postId}</h1>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const postId = params.postId;
  return {
    props: {
      postId,
    },
  };
}

export default PostPage;
