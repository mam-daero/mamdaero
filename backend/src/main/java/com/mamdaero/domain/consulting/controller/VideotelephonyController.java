package com.mamdaero.domain.consulting.controller;

import com.mamdaero.domain.consulting.dto.EnterRoomRequest;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class VideotelephonyController {

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;


    @PostMapping(value = "/cm/videotelephony/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody EnterRoomRequest request) {
        if (request.getReservationId() == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "reservationId is required"));
        }
        /**
         * 예약 아이디와 멤버 아이디를 확인한다.
         * 예약 아이디가 null이거나 존재하지 않는 예약이면 bad request
         * 멤버 아이디가 null이거나 존재하지 않는 멤버이면 bad request
         * 예약 조회해와서 멤버 아이디랑 비교해서 일치하지 않으면 bad request
         * 상담사는 어떻게 가져오지?
         *
         */
        String roomName = request.getReservationId().toString();
        String participantName = "멤버이름가져오기";

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        return ResponseEntity.ok(Map.of("token", token.toJwt()));
    }

    @PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        try {
            LivekitWebhook.WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
        } catch (Exception e) {
            System.err.println("Error validating webhook event: " + e.getMessage());
        }
        return ResponseEntity.ok("ok");
    }
}
