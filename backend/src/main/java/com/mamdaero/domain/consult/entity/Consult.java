package com.mamdaero.domain.consult.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consult")
public class Consult {

    @Id
    @Column(name = "consult_id")
    private Long id;

    @Column(name = "start_at")
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "script_url", length = 256)
    private String scriptUrl;

    @Column(name = "summarized_script_url", length = 256)
    private String summarizedScriptUrl;

    public Consult(Long reservationId) {
        this.id = reservationId;
        this.startAt = LocalDateTime.now();
        this.endAt = null;
        this.scriptUrl = null;
        this.summarizedScriptUrl = null;
    }
}