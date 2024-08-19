package com.mamdaero.domain.notification.service;

import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.notification.controller.NotificationController;
import com.mamdaero.domain.notification.dto.NotificationResponse;
import com.mamdaero.domain.notification.entity.Notification;
import com.mamdaero.domain.notification.repository.NotificationRepository;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FindUserService findUserService;

    // 메시지 알림
    public SseEmitter subscribe() {
        Long memberId = findUserService.findMemberId();

        // 현재 클라이언트를 위한 sseEmitter 생성
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        try {
            // 연결
            sseEmitter.send(SseEmitter.event().name("connect"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // user 의 pk 값을 key 값으로 해서 sseEmitter 를 저장
        NotificationController.sseEmitters.put(memberId, sseEmitter);

        sseEmitter.onCompletion(() -> NotificationController.sseEmitters.remove(memberId));
        sseEmitter.onTimeout(() -> NotificationController.sseEmitters.remove(memberId));
        sseEmitter.onError((e) -> NotificationController.sseEmitters.remove(memberId));

        return sseEmitter;
    }

    public Pagination<NotificationResponse> notification(int page, int size) {
        Long memberId = findUserService.findMemberId();

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> list = notificationRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable);

        List<NotificationResponse> responses = list.getContent().stream()
                .map(NotificationResponse::of)
                .toList();

        return new Pagination<>(
                responses,
                list.getNumber() + 1,
                list.getTotalPages(),
                list.getSize(),
                (int) list.getTotalElements()
        );
    }

    // 알림 삭제
    public void deleteNotification(Long id) throws IOException {
        Notification notification = notificationRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("알림을 찾을 수 없습니다.")
        );

        notificationRepository.delete(notification);
    }

    // 알림 읽음
    @Transactional
    public void readNotification(Long id) throws IOException {
        Notification notification = notificationRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("알림을 찾을 수 없습니다.")
        );

        notification.setIsRead(true);
    }
}
