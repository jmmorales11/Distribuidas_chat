import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, MARK_MESSAGES_AS_READ } from "./ActionType";

// Initial state for the message store
const initialValue = {
  messages: null, // Holds an array of messages
  newMessage: null, // Holds data related to a newly created message
};

// Reducer function for handling message-related actions
export const messageReducer = (store = initialValue, { type, payload }) => {
  switch (type) {
    case CREATE_NEW_MESSAGE:
      return { ...store, newMessage: payload };

    case GET_ALL_MESSAGE:
      return { ...store, messages: payload };

    case MARK_MESSAGES_AS_READ:
      // Update the messages array to mark as read
      const updatedMessages = store.messages?.map((msg) => {
        if (msg.chat.id === payload.chatId) {
          return { ...msg, isRead: true }; // Mark the message as read
        }
        return msg; // Leave other messages unchanged
      });

      return { ...store, messages: updatedMessages };

    default:
      return store; // Return the unchanged store for unknown actions
  }
};