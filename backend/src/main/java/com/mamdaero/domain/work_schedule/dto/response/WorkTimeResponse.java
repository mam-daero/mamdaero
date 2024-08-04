package com.mamdaero.domain.work_schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkTimeResponse {
    private Long id;
    private Long counselorId;
    private LocalDate date;
    private Boolean isReserved;
    private Boolean isWorkTime;
}
