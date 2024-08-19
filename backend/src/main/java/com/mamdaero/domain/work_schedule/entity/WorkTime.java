package com.mamdaero.domain.work_schedule.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class WorkTime {
    @Id
    @Column(name = "worktime_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long counselorId;
    private LocalDate date;
    private Integer time;
    private Boolean isReserved;
    @Column(name = "is_worktime")
    private Boolean isWorkTime;

    public void reserve() {
        this.isReserved = true;
    }

    public void cancelReserve() {
        this.isReserved = false;
    }

    public void work() {
        this.isWorkTime = true;
    }

    public void cancelWork() {
        this.isWorkTime = false;
    }
}
