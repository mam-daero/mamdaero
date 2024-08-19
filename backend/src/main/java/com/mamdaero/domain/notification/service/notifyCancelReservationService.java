package com.mamdaero.domain.notification.service;

import com.mamdaero.domain.counselor_item.entity.CounselorItem;
import com.mamdaero.domain.counselor_item.repository.CounselorItemRepository;
import com.mamdaero.domain.notification.controller.NotificationController;
import com.mamdaero.domain.notification.entity.EventSource;
import com.mamdaero.domain.notification.entity.Notification;
import com.mamdaero.domain.notification.repository.NotificationRepository;
import com.mamdaero.domain.reservation.entity.Reservation;
import com.mamdaero.domain.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class notifyCancelReservationService {

    private final NotificationRepository notificationRepository;
    private final ReservationRepository reservationRepository;
    private final CounselorItemRepository counselorItemRepository;

    public void notifyCancelReservationSave(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(
                () -> new IllegalArgumentException("예약을 찾을 수 없습니다.")
        );

        CounselorItem counselorItem = counselorItemRepository.findById(reservation.getCounselorItemId()).orElseThrow(
                () -> new IllegalArgumentException("상담 상품을 찾을 수 없습니다.")
        );

        Long memberId = reservation.getMemberId();
        Long counselorId = counselorItem.getCounselorId();

        // 내담자
        Notification notification = new Notification();
        notification.setCreatedAt(reservation.getCanceledAt());
        notification.setContent("예약이 취소되었습니다");
        notification.setEventSource(EventSource.RESERVATION);
        notification.setEventId(reservationId);
        notification.setMemberId(memberId);
        notification.setIsDelete(false);
        notification.setIsRead(false);

        notificationRepository.save(notification);

        //상담자
        notification = new Notification();
        notification.setCreatedAt(reservation.getCanceledAt());
        notification.setContent("예약이 취소되었습니다");
        notification.setEventSource(EventSource.RESERVATION);
        notification.setEventId(reservationId);
        notification.setMemberId(counselorId);
        notification.setIsDelete(false);
        notification.setIsRead(false);

        notificationRepository.save(notification);

        notifyCancelReservation(reservation, counselorItem);
    }

    // 상담사, 내담자 예약 취소
    public void notifyCancelReservation(Reservation reservation, CounselorItem counselorItem) {
        Long memberId = reservation.getMemberId();
        Long counselorId = counselorItem.getCounselorId();

        if (NotificationController.sseEmitters.containsKey(memberId)) {
            SseEmitter sseEmitter = NotificationController.sseEmitters.get(memberId);
            try {
                Map<String, String> eventData = new HashMap<>();
                eventData.put("message", "예약이 취소되었습니다");
                eventData.put("createdAt", reservation.getCanceledAt().toString());

                sseEmitter.send(SseEmitter.event().name("reservation").data(eventData));
            } catch (IOException e) {
                NotificationController.sseEmitters.remove(memberId);
            }
        }
    }
}
