import { BASE_API_URL } from "../../config/api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, MARK_MESSAGES_AS_READ } from "./ActionType.js";

// Action creator for creating a new message
export const createMessage = (messageData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messageData.token}`,
      },
      body: JSON.stringify(messageData.data),
    });

    const data = await res.json();
    console.log("create message ", data);

    // Dispatch an action with the created message data
    dispatch({ type: CREATE_NEW_MESSAGE, payload: data });
  } catch (error) {
    console.log("catch error ", error);
  }
};

// Action creator for getting all messages for a chat
export const getAllMessages = (reqData) => async (dispatch) => {
  console.log("Came inside get all messages");

  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/${reqData.chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${reqData.token}`,
      },
    });

    const data = await res.json();
    console.log("get all messages from action method", data);

    // Dispatch an action with the fetched messages data
    dispatch({ type: GET_ALL_MESSAGE, payload: data });
  } catch (error) {
    console.log("catch error ", error);
  }
};

// Acción para marcar mensajes como leídos
export const markMessagesAsRead = (chatId, token) => async (dispatch) => {
  try {
    // Realiza la llamada al backend para marcar los mensajes como leídos
    await fetch(`http://localhost:8080/api/messages/markAsRead/${chatId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Despacha la acción para actualizar el estado global
    dispatch({
      type: MARK_MESSAGES_AS_READ,
      payload: { chatId },
    });

    console.log(`Mensajes del chat ${chatId} marcados como leídos.`);
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
  }
};



