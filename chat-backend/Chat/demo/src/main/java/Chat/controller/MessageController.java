package Chat.controller;

import Chat.model.Message;
import Chat.model.PrivateMessage;
import Chat.repository.MessageRepository;
import Chat.repository.PrivateMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final PrivateMessageRepository privateMessageRepository;

    public MessageController(MessageRepository messageRepository, PrivateMessageRepository privateMessageRepository) {
        this.messageRepository = messageRepository;
        this.privateMessageRepository = privateMessageRepository;
    }

    // Obtener los últimos 5 mensajes generales
    @GetMapping("/general")
    public List<Message> getLastGeneralMessages() {
        return messageRepository.findTop5ByOrderByTimestampDesc();
    }

    // Obtener los últimos 5 mensajes privados para un receptor específico
    @GetMapping("/private/{receiver}")
    public List<PrivateMessage> getLastPrivateMessages(@PathVariable String receiver) {
        return privateMessageRepository.findTop5ByReceiverOrderByTimestampDesc(receiver);
    }
}
