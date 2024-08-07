package com.mamdaero.domain.consult_report.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConsultingReportRequestDto {

    private String title;
    private String detail;
    private String opinion;
}
