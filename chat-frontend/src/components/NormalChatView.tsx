import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsAppChat from './WhatsAppChat';
import WebSocketService from '../services/WebSocketService';
import './NormalChatView.css';

const webSocketService = new WebSocketService();

interface NormalChatViewProps {
  isGeneral?: boolean;
}

export default function NormalChatView({ isGeneral = false }: NormalChatViewProps) {
  const [contactName, setContactName] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (contactName.trim() || isGeneral) {
      setChatStarted(true);
      const roomName = isGeneral ? 'general' : contactName.trim();
      webSocketService.send({ type: 'JOIN', roomName });
    }
  };

  if (chatStarted) {
    const room = {
      id: isGeneral ? 'general' : 'normal',
      name: isGeneral ? 'Sala General' : contactName
    };
    return (
      <WhatsAppChat
        room={room}
        onBack={() => {
          webSocketService.send({ type: 'LEAVE', roomName: room.name });
          setChatStarted(false);
        }}
      />
    );
  }

  return (
    <div className="normal-chat">
      <div className="normal-chat-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>
        <h2 className="normal-chat-title">
          {isGeneral ? 'Unirse a sala general' : 'Iniciar chat normal'}
        </h2>
      </div>
      <div className="normal-chat-content">
        {!isGeneral && (
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Nombre del contacto"
            className="contact-name-input"
          />
        )}
        <button 
          onClick={handleStartChat}
          className="start-chat-button"
          disabled={!isGeneral && !contactName.trim()}
        >
          {isGeneral ? 'Unirse a sala general' : 'Iniciar chat'}
        </button>
      </div>
    </div>
  );
}

