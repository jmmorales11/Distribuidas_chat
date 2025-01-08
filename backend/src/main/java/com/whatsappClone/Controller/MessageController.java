package com.whatsappClone.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import com.whatsappClone.Exception.ChatException;
import com.whatsappClone.Exception.MessageException;
import com.whatsappClone.Exception.UserException;
import com.whatsappClone.Model.Message;
import com.whatsappClone.Model.User;
import com.whatsappClone.Payload.ApiResponse;
import com.whatsappClone.Payload.SendMessageRequest;
import com.whatsappClone.ServiceImpl.MessageServiceImpl;
import com.whatsappClone.ServiceImpl.UserServiceImpl;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageServiceImpl messageService;

    @Autowired
    private UserServiceImpl userService;

    // Inyecta SimpMessagingTemplate para enviar mensajes en tiempo real
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest sendMessageRequest,
                                                      @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt);

        sendMessageRequest.setUserId(user.getId());

        // Guardar el mensaje en la base de datos
        Message message = this.messageService.sendMessage(sendMessageRequest);

        // Enviar el mensaje al canal WebSocket correspondiente
        messagingTemplate.convertAndSend("/group/" + message.getChat().getId(), message);

        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<List<Message>> getChatMessageHandler(@PathVariable Integer chatId,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User user = this.userService.findUserProfile(jwt);

        List<Message> messages = this.messageService.getChatsMessages(chatId, user);

        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException, MessageException {

        User user = this.userService.findUserProfile(jwt);

        this.messageService.deleteMessage(messageId, user);

        ApiResponse res = new ApiResponse("Deleted successfully......", false);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/markAsRead/{chatId}")
    public ResponseEntity<ApiResponse> markMessagesAsReadHandler(@PathVariable Integer chatId,
                                                                 @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        // Obtener el usuario actual desde el token
        User user = this.userService.findUserProfile(jwt);

        // Actualizar los mensajes como leídos
        this.messageService.markMessagesAsRead(chatId, user.getId());

        ApiResponse response = new ApiResponse("Messages marked as read", true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }




}
