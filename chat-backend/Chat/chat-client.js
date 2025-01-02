// URL del WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

// Elementos del DOM
const generalMessagesContainer = document.getElementById('general-messages');
const privateMessagesContainer = document.getElementById('private-messages');
const sendGeneralMessageButton = document.getElementById('send-general');
const sendPrivateMessageButton = document.getElementById('send-private');

// Usuario actual (cambia esto dinámicamente según el usuario autenticado)
const currentUser = 'Usuario1';

// Conexión al WebSocket
stompClient.connect({}, () => {
    console.log('Conectado al WebSocket');

    // Suscribirse a mensajes generales
    stompClient.subscribe('/topic/general', (message) => {
        const messageData = JSON.parse(message.body);
        showGeneralMessage(`[General] ${messageData.sender}: ${messageData.content}`);
    });

    // Suscribirse a mensajes privados
    stompClient.subscribe(`/user/${currentUser}/queue/messages`, (message) => {
        const messageData = JSON.parse(message.body);
        showPrivateMessage(`[Privado de ${messageData.sender}]: ${messageData.content}`);
    });

    // Cargar los últimos 5 mensajes al conectar
    fetchLastGeneralMessages();
    fetchLastPrivateMessages();
});

// Mostrar mensajes generales
function showGeneralMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    generalMessagesContainer.appendChild(messageElement);
}

// Mostrar mensajes privados
function showPrivateMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    privateMessagesContainer.appendChild(messageElement);
}

// Enviar mensaje general
sendGeneralMessageButton.addEventListener('click', () => {
    const messageContent = document.getElementById('general-message').value;
    const message = {
        sender: currentUser,
        content: messageContent,
    };

    stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
    document.getElementById('general-message').value = '';
});

// Enviar mensaje privado
sendPrivateMessageButton.addEventListener('click', () => {
    const messageContent = document.getElementById('private-message').value;
    const receiver = document.getElementById('private-receiver').value;
    const message = {
        sender: currentUser,
        receiver: receiver,
        content: messageContent,
    };

    stompClient.send('/app/private', {}, JSON.stringify(message));
    document.getElementById('private-message').value = '';
    document.getElementById('private-receiver').value = '';
});

// Cargar los últimos 5 mensajes generales desde el servidor
function fetchLastGeneralMessages() {
    fetch('http://localhost:8080/api/messages/general')
        .then((response) => response.json())
        .then((messages) => {
            messages.reverse().forEach((message) => {
                showGeneralMessage(`[General] ${message.sender}: ${message.content}`);
            });
        });
}

// Cargar los últimos 5 mensajes privados desde el servidor
function fetchLastPrivateMessages() {
    fetch(`http://localhost:8080/api/messages/private/${currentUser}`)
        .then((response) => response.json())
        .then((messages) => {
            messages.reverse().forEach((message) => {
                showPrivateMessage(`[Privado de ${message.sender}]: ${message.content}`);
            });
        });
}
