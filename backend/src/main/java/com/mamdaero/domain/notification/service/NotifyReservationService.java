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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class
NotifyReservationService {

    private final NotificationRepository notificationRepository;
    private final ReservationRepository reservationRepository;
    private final CounselorItemRepository counselorItemRepository;

    private List<Reservation> getUpcomingReservations(LocalDateTime threshold) {
        LocalDate date = threshold.toLocalDate();
        LocalTime time = threshold.toLocalTime();
        int timeInt = time.getMinute() + 15;

        if(timeInt != 60) {
            return null;
        }

        return reservationRepository.findReservationsBefore(date, time.getHour() + 1);
    }

    @Scheduled(cron = "0 45 * * * ?")
    @Transactional
    public void notifyReservationSave() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> upcomingReservations = getUpcomingReservations(now);

        if (upcomingReservations == null) {
            return;
        }

        for (Reservation reservation : upcomingReservations) {

            CounselorItem counselorItem = counselorItemRepository.findById(reservation.getCounselorItemId()).orElseThrow(
                    () -> new IllegalArgumentException("상담 상품을 찾을 수 없습니다.")
            );

            Long memberId = reservation.getMemberId();
            Long counselorId = counselorItem.getCounselorId();

            // 내담자
            Notification notification = new Notification();
            notification.setCreatedAt(now);
            notification.setContent("상담 15분 전입니다");
            notification.setEventSource(EventSource.RESERVATION);
            notification.setEventId(reservation.getId());
            notification.setMemberId(memberId);
            notification.setIsDelete(false);
            notification.setIsRead(false);

            notificationRepository.save(notification);

            //상담자
            notification = new Notification();
            notification.setCreatedAt(now);
            notification.setContent("상담 15분 전입니다");
            notification.setEventSource(EventSource.RESERVATION);
            notification.setEventId(reservation.getId());
            notification.setMemberId(counselorId);
            notification.setIsDelete(false);
            notification.setIsRead(false);
            notification.setMemberId(counselorId);

            notificationRepository.save(notification);
        }
    }

    @Scheduled(cron = "0 45 * * * ?")
    @Transactional
    public void notifyReservation() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> upcomingReservations = getUpcomingReservations(now);

        if (upcomingReservations == null) {
            return;
        }

        for (Reservation reservation : upcomingReservations) {
            notifyBeforeReservation(reservation, now);
        }
    }

    private void notifyBeforeReservation(Reservation reservation, LocalDateTime threshold) {
        CounselorItem counselorItem = counselorItemRepository.findById(reservation.getCounselorItemId()).orElseThrow(
                () -> new IllegalArgumentException("상담 상품을 찾을 수 없습니다.")
        );

        Long memberId = reservation.getMemberId();
        Long counselorId = counselorItem.getCounselorId();

        if (NotificationController.sseEmitters.containsKey(memberId)) {
            SseEmitter sseEmitter = NotificationController.sseEmitters.get(memberId);
            try {
                Map<String, String> eventData = new HashMap<>();
                eventData.put("message", "상담 15분 전입니다");
                eventData.put("createdAt", reservation.getCanceledAt().toString());

                sseEmitter.send(SseEmitter.event().name("reservation").data(eventData));
            } catch (IOException e) {
                NotificationController.sseEmitters.remove(memberId);
            }
        }
    }
}
