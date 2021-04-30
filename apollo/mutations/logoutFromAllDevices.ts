import { useRouter } from 'next/router';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { authVar, currentSocketVar } from 'apollo/store';
import { GET_ROOMS } from 'apollo/queries';

export const LOGOUT_FROM_ALL_DEVICES = gql`
  mutation LogoutFromAllDevices {
    logoutFromAllDevices
  }
`;

export const useLogout = () => {
  const _currentSocketVar = useReactiveVar(currentSocketVar);
  const router = useRouter();
  const [logout, { data, error, client }] = useMutation(LOGOUT_FROM_ALL_DEVICES, {
    onCompleted: () => {
      const existingRooms = client.cache.readQuery({
        query: GET_ROOMS,
      }) as { rooms: any[] };

      existingRooms.rooms.forEach(room => {
        _currentSocketVar.send(
          JSON.stringify({
            ROOM_ID: room.id,
            action: 'leaveRoom',
          }),
        );
      });

      client.cache.reset();
      authVar({ isLogined: false, access_token: '', userId: '', name: '', expires_in: 0 });
      router.push('/login');
    },
  });

  return { logout, data, error };
};
