package com.mamdaero.domain.consult_report.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConsultReportRequest {
    private String title;
    private String detail;
    private String opinion;
}
