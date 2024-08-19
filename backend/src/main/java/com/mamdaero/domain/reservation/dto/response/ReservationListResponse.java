package com.mamdaero.domain.reservation.dto.response;

import com.mamdaero.domain.reservation.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationListResponse {
    private Long reservationId;
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
    private String memberName;
    private String counselorName;
    private Boolean isReview;
}