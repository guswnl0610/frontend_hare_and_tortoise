import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { invitedRoomIdVar, authVar } from 'apollo/store';
import { useSaveReceiver } from 'apollo/mutations/saveReceiver';
import Skeleton from 'components/Skeleton';
import NavigationBar from 'components/NavigationBar';

function Invitation({ isLogined }: { isLogined: boolean }) {
  const router = useRouter();
  const _authVar = useReactiveVar(authVar);
  const { ROOM_ID } = router.query;
  const { saveReceiver } = useSaveReceiver();

  useEffect(() => {
    if (!ROOM_ID || !_authVar) return;
    if (!_authVar?.access_token) {
      invitedRoomIdVar(ROOM_ID as string);
      router.push('/login');
      return;
    }
    saveReceiver({
      variables: {
        room_id: ROOM_ID,
      },
    });
  }, [_authVar, ROOM_ID]);

  if (!_authVar || !_authVar?.access_token)
    return (
      <div className="h-screen">
        <Skeleton />
      </div>
    );
  return (
    <>
      <Head>
        <title>토끼와 거북이</title>
      </Head>
      <main className="px-6">
        <NavigationBar title="" />
        <div className="relative h-full">
          <Skeleton />
        </div>
      </main>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   console.log(ctx);

//   return {
//     props: {},
//   };
// };

export default Invitation;
