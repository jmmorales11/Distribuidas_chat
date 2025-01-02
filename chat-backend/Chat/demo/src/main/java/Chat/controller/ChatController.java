package Chat.controller;

import Chat.model.Message;
import Chat.model.PrivateMessage;
import Chat.repository.MessageRepository;
import Chat.repository.PrivateMessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final PrivateMessageRepository privateMessageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate,
                          MessageRepository messageRepository,
                          PrivateMessageRepository privateMessageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.privateMessageRepository = privateMessageRepository;
    }

    @MessageMapping("/sendMessage")
    public void handleGeneralMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/general", message);
    }

    @MessageMapping("/private")
    public void handlePrivateMessage(PrivateMessage privateMessage) {
        privateMessage.setTimestamp(LocalDateTime.now());
        privateMessageRepository.save(privateMessage);
        messagingTemplate.convertAndSend(
                "/user/" + privateMessage.getReceiver() + "/queue/messages",
                privateMessage
        );
    }
}

