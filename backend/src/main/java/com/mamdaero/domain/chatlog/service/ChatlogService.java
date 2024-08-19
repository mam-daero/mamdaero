package com.mamdaero.domain.chatlog.service;

import com.mamdaero.domain.chatlog.entity.Chatlog;
import com.mamdaero.domain.chatlog.repository.ChatlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatlogService {

    private final ChatlogRepository chatlogRepository;

    public Page<Chatlog> findAllByReservationId(Long reservationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return chatlogRepository.findByReservationId(reservationId, pageable);
    }

    public Chatlog save(Long reservationId, Long memberId, String message) {
        Chatlog chatLog = Chatlog.builder()
                .reservationId(reservationId)
                .memberId(memberId)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();

        chatlogRepository.save(chatLog);

        return chatLog;
    }
}
