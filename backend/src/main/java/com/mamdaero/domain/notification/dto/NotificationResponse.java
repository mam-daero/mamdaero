package com.mamdaero.domain.notification.dto;

import com.mamdaero.domain.notification.entity.EventSource;
import com.mamdaero.domain.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private EventSource eventSource;
    private Long eventId;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isRead;

    public static NotificationResponse of(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .eventSource(notification.getEventSource())
                .eventId(notification.getEventId())
                .content(notification.getContent())
                .createdAt(notification.getCreatedAt())
                .isRead(notification.getIsRead())
                .build();
    }
}
