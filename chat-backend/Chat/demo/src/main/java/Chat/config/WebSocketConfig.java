package Chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Configuración del broker para mensajes generales y privados
        config.enableSimpleBroker("/topic", "/queue");
        // Prefijo para mensajes enviados por los clientes al servidor
        config.setApplicationDestinationPrefixes("/app");
        // Prefijo para enviar mensajes privados a usuarios específicos
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Permite cualquier origen, pero considera restringirlo para producción
                .withSockJS(); // Soporte para SockJS si WebSocket no está disponible
    }
}
