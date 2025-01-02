import React, { useState, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';
import './WhatsAppChat.css';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  isSent: boolean;
  userId: string;
}

interface Room {
  id: string;
  name: string;
}

interface WhatsAppChatProps {
  room: Room;
  onBack: () => void;
}

const webSocketService = new WebSocketService();

export default function WhatsAppChat({ room, onBack }: WhatsAppChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'MESSAGE' && message.roomName === room.name) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: message.message || '',
          timestamp: new Date(),
          isSent: message.userId === 'self', // Adjust based on the current user's ID
          userId: message.userId || 'unknown'
        }]);
      }
    };

    webSocketService.addMessageHandler(handleMessage);

    return () => {
      webSocketService.removeMessageHandler(handleMessage);
    };
  }, [room.name]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const newMessage = {
        type: 'MESSAGE',
        roomName: room.name,
        message: inputMessage.trim(),
      };
      webSocketService.send(newMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="whatsapp-chat">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <div className="avatar"></div>
        <div className="chat-info">
          <p className="chat-name">{room.name}</p>
          <p className="chat-status">
            <span className="status-indicator"></span>
            Activo
          </p>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isSent ? 'message-sent' : 'message-received'}`}
          >
            {!message.isSent && (
              <p className="message-user">{message.userId}</p>
            )}
            <p className="message-text">{message.text}</p>
            <p className="message-time">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe un mensaje"
          className="chat-input"
        />
        <button type="submit" className="send-button">
          →
        </button>
      </form>
    </div>
  );
}

