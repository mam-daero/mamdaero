package com.mamdaero.domain.consult_report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultReportListResponse {
    private String clientName;
    private LocalDate date;
    private Integer time;
    private String scriptUrl;
    private String summarizedScriptUrl;
    private Long reportId;
}
