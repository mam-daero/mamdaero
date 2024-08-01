package com.mamdaero.domain.reservation.dto.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CreateReservationRequest {
    private Long counselorItemId;
    private Long workTimeId;
    private String requirement;
    private Boolean isDiaryShared;
}
