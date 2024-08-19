package com.mamdaero.domain.work_schedule.entity;

import com.mamdaero.domain.work_schedule.dto.request.WorkScheduleRequest;
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


    public void update(WorkScheduleRequest request) {
        this.day = request.getDay();
        this.startTime = request.getStartTime();
        this.endTime = request.getEndTime();
    }
}

