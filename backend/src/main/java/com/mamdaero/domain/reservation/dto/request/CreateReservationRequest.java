package com.mamdaero.domain.reservation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateReservationRequest {
    private Long counselorItemId;
    private Long workTimeId;
    private String requirement;
    private Boolean isDiaryShared;
    private Boolean isTestShared;
    private List<Long> symptomIds;
    private List<Long> situationIds;
}
