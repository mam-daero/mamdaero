package com.mamdaero.domain.reservation.dto.response;

import com.mamdaero.domain.reservation.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long reservationId;
    private Long memberId;
    private Long CounselorId;
    private LocalDate date;
    private Integer time;
    private Status status;
    private String itemName;
    private Integer itemFee;
    private String canceler;
    private LocalDateTime canceledAt;
    private String requirement;
    private Boolean isDiaryShared;
    private Boolean isTestShared;
    private List<SituationResponse> situations;
    private List<SymptomResponse> symptoms;
}
