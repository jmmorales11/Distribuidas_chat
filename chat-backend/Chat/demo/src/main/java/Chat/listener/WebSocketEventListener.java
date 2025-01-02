package Chat.listener;

import Chat.service.UserService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        userService.addUser(event);
        messagingTemplate.convertAndSend("/topic/notifications", "Un usuario se conectó");
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        userService.removeUser(event);
        messagingTemplate.convertAndSend("/topic/notifications", "Un usuario se desconectó");
    }
}

