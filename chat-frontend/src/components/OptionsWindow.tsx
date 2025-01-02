import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../services/WebSocketService';
import './OptionsWindow.css';

const webSocketService = new WebSocketService();

export default function OptionsWindow() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    webSocketService.connect();

    const handleMessage = (message: any) => {
      switch (message.type) {
        case 'USER_JOINED':
          setNotifications(prev => [...prev, `Usuario ${message.userId} se unió a la sala ${message.roomName}`]);
          break;
        case 'USER_LEFT':
          setNotifications(prev => [...prev, `Usuario ${message.userId} dejó la sala ${message.roomName}`]);
          break;
      }
    };

    webSocketService.addMessageHandler(handleMessage);

    return () => {
      webSocketService.removeMessageHandler(handleMessage);
    };
  }, []);

  return (
    <div className="options-window">
      <div className="options-content">
        <h1 className="options-title">WhatsApp Clone</h1>
        <button 
          onClick={() => navigate('/create-room')}
          className="options-button"
        >
          Crear una sala privada
        </button>
        <button 
          onClick={() => navigate('/normal-chat')}
          className="options-button"
        >
          Iniciar chat normal
        </button>
        <button 
          onClick={() => navigate('/general-chat')}
          className="options-button"
        >
          Unirse a sala general
        </button>
      </div>
      {notifications.length > 0 && (
        <div className="notifications">
          <h3>Notificaciones</h3>
          {notifications.map((notification, index) => (
            <p key={index} className="notification">{notification}</p>
          ))}
        </div>
      )}
    </div>
  );
}

