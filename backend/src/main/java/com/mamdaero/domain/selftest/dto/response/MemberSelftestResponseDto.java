package com.mamdaero.domain.selftest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberSelftestResponseDto {
    private Integer memberSelfTestId;
    private Integer selftestId;
    private Integer selftestTotalScore;

}
