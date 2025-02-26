import { io } from 'socket.io-client';

import socketUrl from './ServerUrl';

// socket을 export
const socket = new WebSocket(socketUrl);

export default socket;

export const handelSocketReceiveMessage = (data) => {
    console.log("message 도착");
    console.log(data);
    const dataActionType = data?.action;

    return dataActionType;
}