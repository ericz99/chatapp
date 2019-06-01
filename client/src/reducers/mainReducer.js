import {
  UPDATED_ROOM_LIST,
  ONLINE_USERS,
  UPDATED_USER_LIST,
  NEW_MESSAGE,
  ALL_ROOM,
  SET_CURRENT_NAME
} from "../types";

const initialState = {
  rooms: [],
  names: [],
  name: "",
  messages: [],
  message: {},
  joinedRoom: false,
  selectedRoom: {},
  userTyping: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATED_ROOM_LIST:
      return {
        ...state,
        rooms: action.rooms
      };
    case ALL_ROOM:
      return {
        ...state,
        rooms: action.rooms
      };
    case SET_CURRENT_NAME:
      return {
        ...state,
        name: action.name
      };
    case ONLINE_USERS:
      return {
        ...state,
        names: action.names
      };
    case UPDATED_USER_LIST:
      return {
        ...state,
        names: action.names
      };
    case NEW_MESSAGE:
      return {
        ...state,
        messages: action.messages
      };
    case "SUCCESS":
      return {
        ...state,
        joinedRoom: action.data.status === "joined" ? true : false,
        selectedRoom: action.data.status === "leave" ? {} : action.data.room
      };
    case "USER_TYPING":
      return {
        ...state,
        userTyping: action.name !== null ? action.name : ""
      };
    default:
      return state;
  }
}
