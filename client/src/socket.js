import { UPDATED_ROOM_LIST, ONLINE_USERS, UPDATED_USER_LIST, NEW_MESSAGE, ALL_ROOM } from './types';

import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const configureSocket = (dispatch) => {
    socket.on('connect', () => {
        console.log('cliented connected!');
    });

    socket.on("UPDATED_USER_LIST", (names) => {
        dispatch({
            type: UPDATED_USER_LIST,
            names
        });
    });

    socket.on("UPDATED_ROOM_LIST", (rooms) => {
        dispatch({
            type: UPDATED_ROOM_LIST,
            rooms
        });
    });

    socket.on("ONLINE_USERS", (names) => {
        dispatch({
            type: ONLINE_USERS,
            names
        });
    });

    socket.on("ALL_ROOM", (rooms) => {
        dispatch({
            type: ALL_ROOM,
            rooms
        });
    });

    socket.on("NEW_MESSAGE", (messages) => {
        dispatch({
            type: NEW_MESSAGE,
            messages
        })
    });

    socket.on("SUCCESS", (data) => {
        dispatch({
            type: "SUCCESS",
            data
        });
    });


    return socket;
}

// Get all rooms
export const getAllRoom = () => socket.emit("GET_ALL_ROOM");

// Get current user online i
export const getCurrentUserOnline = () => socket.emit("GET_CURRENT_ONLINE_USER");

// Create new room 
export const createNewRoom = (roomName) => {
    socket.emit("CREATE_NEW_ROOM", roomName);
}

// Create new User
export const createNewUser = (name) => {
    socket.emit("CREATE_NEW_USER", name)
}

// Join room
export const joinRoom = (roomName) => {
    socket.emit("JOIN_ROOM", roomName);
}

// Leave room
export const leaveRoom = (roomName) => {
    socket.emit("LEAVE_ROOM", roomName);
}

// Create new message
export const sendMessage = (msg, roomName) => {
    socket.emit("SEND_MESSAGE", { msg, roomName })
}

export default configureSocket;