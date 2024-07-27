package com.example.mamdaero.work_schedule.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class WorkSchedule {
    @Id
    @Column(name = "work_schedule_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long counselorId;
    private Integer day;
    private Integer startTime;
    private Integer endTime;

}

