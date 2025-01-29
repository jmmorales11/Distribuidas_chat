import React from 'react';
import ChatCard from '../ChatCard/ChatCard';

const ChatList = ({
  querys,
  auth,
  chat,
  lastMessages,
  handleClickOnChatCard,
  handleCurrentChat,
}) => {
  console.log("lastMessages:", lastMessages); // Agrega aquí el console.log para revisar los datos

  return (
    <div className="bg-white overflow-y-scroll h-[73vh] px-3">
      {/* Muestra los usuarios que coinciden con la búsqueda */}
      {querys &&
        auth.searchUser?.map((item, index) => (
          <div key={index} onClick={() => handleClickOnChatCard(item.id)}>
            <hr />
            <ChatCard
              name={item.name}
              userImg={item.profile}
              lastMessage={{
                content: lastMessages[item.id]?.content || "Iniciar la conversación",
                timestamp: lastMessages[item.id]?.timestamp || "",
              }}
              status={item.status}
              hasUnreadMessages={lastMessages[item.id]?.read === false} // Verifica si el último mensaje no está leído
            />
          </div>
        ))}

      {/* Muestra los chats existentes */}
      {chat?.chats?.length > 0 && !querys && chat?.chats?.map((item, index) => {
        console.log("Last message for chat:", item.id, lastMessages[item.id]);
        
        return (
          <div key={index} onClick={() => { handleCurrentChat(item); console.log("the item is ", item); }}>
            <hr />
            <ChatCard
              isChat={!item.group}
              name={
                item.group
                  ? item.chatName
                  : auth.reqUser?.id !== item.users[0]?.id
                    ? item.users[0]?.name
                    : item.users[1]?.name
              }
              userImg={
                item.group
                  ? item.profile // Si es un grupo, usa la imagen del grupo
                  : item.users.find(user => user.id !== auth.reqUser?.id)?.profile || // Si es chat individual, usa la imagen del otro usuario
                    "https://media.istockphoto.com/id/521977679/photo/silhouette-of-adult-woman.webp?b=1&s=170667a&w=0&k=20&c=wpJ0QJYXdbLx24H5LK08xSgiQ3zNkCAD2W3F74qlUL0=" // Imagen predeterminada
              }
              lastMessage={{
                content: lastMessages[item.id]?.content || "Iniciar la conversación",
                timestamp: lastMessages[item.id]?.timestamp || "",
              }}
              status={item.users.find((user) => user.id !== auth.reqUser?.id)?.status}
              hasUnreadMessages={lastMessages[item.id]?.read === false} // Verifica si el último mensaje no está leído
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
