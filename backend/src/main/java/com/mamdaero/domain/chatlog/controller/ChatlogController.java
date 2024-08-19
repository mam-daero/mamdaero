package com.mamdaero.domain.chatlog.controller;

import com.mamdaero.domain.chatlog.entity.Chatlog;
import com.mamdaero.domain.chatlog.service.ChatlogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatlogController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatlogService chatlogService;

    // 채팅 리스트 반환
    @GetMapping("/cm/chatlog/{reservation_id}")
    public ResponseEntity<Page<Chatlog>> getChatList(@PathVariable("reservation_id") Long reservation_id,
                                                     @RequestParam(name = "page", defaultValue = "0") int page,
                                                     @RequestParam(name = "size", defaultValue = "10") int size) {

        Page<Chatlog> chatLogList = chatlogService.findAllByReservationId(reservation_id, page, size);

        return ResponseEntity.ok().body(chatLogList);
    }

    @MessageMapping("/chat")
    @SendTo("/sub/message")
    public String sendMessage(String message) {

        return message;
    }

    @MessageMapping("/message")
    public ResponseEntity<Void> receiveMessage(@Payload Chatlog chatLog) {
        chatlogService.save(chatLog.getReservationId(), chatLog.getMemberId(), chatLog.getMessage());
        messagingTemplate.convertAndSend("/sub/chatroom/" + chatLog.getReservationId(), chatLog);
        log.info("Received message: {}", chatLog);

        return ResponseEntity.ok().build();
    }
}