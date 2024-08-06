package com.mamdaero.domain.work_schedule.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkTimeRequest {
    private Long workTimeId;
    private Boolean isWorkTime;


}
