package com.mamdaero.domain.consult_report.dto.response;

import com.mamdaero.domain.consult_report.entity.ConsultReport;
import com.mamdaero.domain.member.repository.CounselorRepository;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConsultReportResponseDto {

    private String memberName;
    private Long reservationId;
    private String counselorItemName;
    private String counselorName;
    private String title;
    private String detail;
    private String opinion;
    private LocalDateTime consultDate;

    public static ConsultReportResponseDto toDTO(ConsultReport consultingReport, CounselorRepository counselorRepository) {
        return ConsultReportResponseDto.builder().build();
//        return ConsultingReportResponseDto.builder()
//                .reservationId(consultingReport.getReservation().getId())
//                .memberName(consultingReport.getReservation().getMember().getName())
//                .counselorItemName(consultingReport.getReservation().getCounselorItem().getName())
//                .counselorName(counselorRepository.findById(consultingReport.getReservation().getCounselorItem().getCounselorId()).get().getName())
//                .title(consultingReport.getTitle())
//                .detail(consultingReport.getDetail())
//                .opinion(consultingReport.getOpinion())
//                .consultDate(consultingReport.getReservation().getRequestedAt())
//                .build();
    }
}
