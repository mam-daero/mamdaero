package com.mamdaero.domain.work_schedule.dto.response;

import com.mamdaero.domain.work_schedule.entity.WorkSchedule;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class WorkScheduleResponse {
    private Long workScheduleId;
    private Long counselorId;
    private Integer day;
    private Integer startTime;
    private Integer endTime;

    public static WorkScheduleResponse toDTO(WorkSchedule workSchedule) {
        return WorkScheduleResponse.builder()
                .workScheduleId(workSchedule.getId())
                .counselorId(workSchedule.getCounselorId())
                .day(workSchedule.getDay())
                .startTime(workSchedule.getStartTime())
                .endTime(workSchedule.getEndTime())
                .build();
    }
}
