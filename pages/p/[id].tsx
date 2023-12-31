import React from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import getPostById from '@/services/api/getPostById';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const postId = params?.id as string | number;
  const post = await getPostById(postId);

  if (post) {
    return {
      props: post,
    };
  } else {
    return {
      props: {},
    };
  }
};

async function publishPost(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

const Post: React.FC<PostProps> = (props) => {

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    setTimeout(() => Router.push('/'), 3000);
    return <p>Please log in first.</p>;
  }

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>{props.body}</p>
        {!props.published && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {
          (
            <button onClick={() => deletePost(props.id)}>Delete</button>
          )
        }
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;