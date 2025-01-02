type WebSocketMessage = {
  type: 'JOIN' | 'LEAVE' | 'MESSAGE' | 'USER_JOINED' | 'USER_LEFT';
  roomName?: string;
  userId?: string;
  message?: string;
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  connect() {
    this.ws = new WebSocket('ws://localhost:8080/chat');
    
    this.ws.onopen = () => {
      console.log('Conectado al servidor');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      console.log('Desconectado del servidor');
      // Intentar reconectar después de 3 segundos
      setTimeout(() => this.connect(), 3000);
    };
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  addMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
}

export default WebSocketService;

