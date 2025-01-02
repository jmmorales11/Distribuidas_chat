package Chat.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();

    public void addUser(SessionConnectedEvent event) {
        // Agrega lógica para extraer el username desde los headers
        activeUsers.add("Username");
    }

    public void removeUser(SessionDisconnectEvent event) {
        // Remueve el usuario basado en la sesión
        activeUsers.remove("Username");
    }

    public Set<String> getActiveUsers() {
        return activeUsers;
    }
}
