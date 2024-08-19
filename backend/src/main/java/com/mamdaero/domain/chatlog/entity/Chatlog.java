package com.mamdaero.domain.chatlog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
public class Chatlog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatlog_id")
    private Long id;
    private Long reservationId;
    private Long memberId;
    private String message;
    @CreatedDate
    private LocalDateTime createdAt;

    public Chatlog(Long reservationId, Long memberId, String message) {
        this.reservationId = reservationId;
        this.memberId = memberId;
        this.message = message;
    }
}
