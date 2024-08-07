package com.mamdaero.domain.consult_report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultReportDetailResponse {
    private Long id;
    private LocalDate date;
    private Integer time;
    private String clientName;
    private String counselorName;
    private String title;
    private String detail;
    private String opinion;
}
