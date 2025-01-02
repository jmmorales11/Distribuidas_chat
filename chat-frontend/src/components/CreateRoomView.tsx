import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatsAppChat from './WhatsAppChat';
import WebSocketService from '../services/WebSocketService';
import './CreateRoomView.css';

const webSocketService = new WebSocketService();

export default function CreateRoomView() {
  const [roomName, setRoomName] = useState('');
  const [createdRoom, setCreatedRoom] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      setCreatedRoom({ id: Date.now().toString(), name: roomName.trim() });
      webSocketService.send({ type: 'JOIN', roomName: roomName.trim() });
    }
  };

  if (createdRoom) {
    return (
      <WhatsAppChat
        room={createdRoom}
        onBack={() => {
          webSocketService.send({ type: 'LEAVE', roomName: createdRoom.name });
          setCreatedRoom(null);
        }}
      />
    );
  }

  return (
    <div className="create-room">
      <div className="create-room-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>
        <h2 className="create-room-title">Crear una sala privada</h2>
      </div>
      <div className="create-room-content">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Nombre de la sala"
          className="room-name-input"
        />
        <button 
          onClick={handleCreateRoom}
          className="create-room-button"
          disabled={!roomName.trim()}
        >
          Crear sala
        </button>
      </div>
    </div>
  );
}

