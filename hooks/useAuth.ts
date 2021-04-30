import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql, useReactiveVar, useLazyQuery } from '@apollo/client';
import { authVar, invitedRoomIdVar } from 'apollo/store';
import { REFRESH_TOKEN } from 'apollo/queries';

export const useAuth = () => {
  const { data, error, loading, refetch } = useQuery(REFRESH_TOKEN, {
    fetchPolicy: 'cache-and-network',
  });
  const timeoutId = useRef<NodeJS.Timeout>(null);
  const _authVar = useReactiveVar(authVar);
  const router = useRouter();

  const setTimer = (second: number) => {
    // if (!_authVar.access_token) return router.push('/login');
    const newtimeoutId = setTimeout(async () => {
      try {
        await refetch();
        // console.log('refetch');
      } catch (error) {
        // console.error('error!', error);
        router.push('/login');
      }
    }, second * 1000);
    timeoutId.current = newtimeoutId;
  };

  useEffect(() => {
    if (!data || error) {
      // refresh 했는데 토큰이 없는경우
      // console.log('data', data, 'error', error);

      authVar({ access_token: '', isLogined: false, userId: '', name: '', expires_in: 0 });
      return;
    }

    const { access_token, id: userId, name, expires_in } = data.refreshToken || {};
    authVar({ access_token, isLogined: true, userId, expires_in, name });
  }, [data]);

  useEffect(() => {
    console.log(_authVar);
    // if (!_authVar || !_authVar.access_token) {
    //   onLogout();
    //   return;
    // }
    if (!_authVar) return;
    setTimer(_authVar?.expires_in - 10);
  }, [_authVar]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return { loading, data };
};
