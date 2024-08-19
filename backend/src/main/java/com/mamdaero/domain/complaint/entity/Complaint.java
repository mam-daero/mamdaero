package com.mamdaero.domain.complaint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "complaint")
public class Complaint {

    @Id
    @Column(name = "complaint_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_source", nullable = false)
    private Source eventSource;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @CreatedDate
    @Column(name = "complaint_at", nullable = false, updatable = false)
    private LocalDateTime complaintAt;

    @Builder
    public Complaint(Long memberId, Source eventSource, Long eventId) {
        this.memberId = memberId;
        this.eventSource = eventSource;
        this.eventId = eventId;
    }
}