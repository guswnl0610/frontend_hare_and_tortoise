import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
const LoginForm = dynamic(() => import('components/LoginForm'));
import { REFRESH_TOKEN } from 'apollo/queries';
import { useEffect } from 'react';

function LoginPage() {
  const router = useRouter();
  // // const _authVar = useReactiveVar(authVar);
  const [refresh] = useLazyQuery(REFRESH_TOKEN, {
    onCompleted: () => {
      router.push('/list');
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <Head>
        <title>토끼와거북이 로그인</title>
      </Head>
      <LoginForm />
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async context => {
//   // const { req, res } = context;
//   const cookies = nookies.get(context);
//   console.log('cookies', cookies);
//   const client = initializeApollo(null);

//   try {
//     const result = client.query({ query: REFRESH_TOKEN });
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }

//   return {
//     props: {},
//   };
// };

export default LoginPage;
