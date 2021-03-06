import { makeVar } from '@apollo/client';
import { Iauth } from 'types';

export const invitedRoomIdVar = makeVar<string>('');
export const authVar = makeVar<Iauth>(null);
export const currentSocketVar = makeVar<null | WebSocket>(null);
export const isSocketConnectedVar = makeVar<boolean>(false);
