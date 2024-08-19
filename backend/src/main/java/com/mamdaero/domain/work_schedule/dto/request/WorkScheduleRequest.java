package com.mamdaero.domain.work_schedule.dto.request;

import com.mamdaero.domain.work_schedule.entity.WorkSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkScheduleRequest {
    private Integer day;
    private Integer startTime;
    private Integer endTime;

    public WorkSchedule toEntity() {
        return WorkSchedule.builder()
                .day(day)
                .startTime(startTime)
                .endTime(endTime)
                .build();
    }
}


