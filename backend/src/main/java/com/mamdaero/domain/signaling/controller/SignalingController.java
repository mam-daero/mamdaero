package com.mamdaero.domain.signaling.controller;

import com.mamdaero.domain.consult.service.ConsultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SignalingController {
    private final ConsultService consultService;

    // offer 정보를 주고 받기 위한 websocket
    @MessageMapping("/peer/offer/{memberId}/{roomId}")
    @SendTo("/sub/peer/offer/{memberId}/{roomId}")
    public String PeerHandleOffer(@Payload String offer, @DestinationVariable(value = "roomId") String roomId,
                                  @DestinationVariable(value = "memberId") String memberId, SimpMessageHeaderAccessor headerAccessor) {
        log.info("[OFFER] {} : {}", memberId, offer);
        log.info("Headers: " + headerAccessor.toNativeHeaderMap());
        System.out.println("Headers: " + headerAccessor.toNativeHeaderMap());
        return offer;
    }

    // iceCandidate 정보를 주고 받기 위한 webSocket
    @MessageMapping("/peer/iceCandidate/{memberId}/{roomId}")
    @SendTo("/sub/peer/iceCandidate/{memberId}/{roomId}")
    public String PeerHandleIceCandidate(@Payload String candidate, @DestinationVariable(value = "roomId") String roomId,
                                         @DestinationVariable(value = "memberId") String memberId, SimpMessageHeaderAccessor headerAccessor) {
        log.info("[ICECANDIDATE] {} : {}", memberId, candidate);
        log.info("Headers: " + headerAccessor.toNativeHeaderMap());


        consultService.create(Long.parseLong(roomId));

        return candidate;
    }

    // answer 정보를 주고 받기 위한 webSocket
    @MessageMapping("/peer/answer/{memberId}/{roomId}")
    @SendTo("/sub/peer/answer/{memberId}/{roomId}")
    public String PeerHandleAnswer(@Payload String answer, @DestinationVariable(value = "roomId") String roomId,
                                   @DestinationVariable(value = "memberId") String memberId, SimpMessageHeaderAccessor headerAccessor) {
        log.info("[ANSWER] {} : {}", memberId, answer);
        log.info("Headers: " + headerAccessor.toNativeHeaderMap());
        return answer;
    }

    // memberId 를 받기위해 신호를 보내는 webSocket
    @MessageMapping("/call/key")
    @SendTo("/sub/call/key")
    public String callKey(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("[CALL KEY] : {}", message);
        log.info("Headers: " + headerAccessor.toNativeHeaderMap());
        return message;
    }

    // 자신의 memberId 를 모든 연결된 세션에 보내는 webSocket
    @MessageMapping("/send/key")
    @SendTo("/sub/send/key")
    public String sendKey(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        log.info("[SEND KEY] : {}", message);
        log.info("Headers: " + headerAccessor.toNativeHeaderMap());
        return message;
    }
}
