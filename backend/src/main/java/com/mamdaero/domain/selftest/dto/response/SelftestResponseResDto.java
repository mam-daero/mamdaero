package com.mamdaero.domain.selftest.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelftestResponseResDto {
    private Integer selftestQuestionResponseId;
    private Integer memberSelftestId;
    private Integer selftestQuestionId;
    private Integer selftestMemberQuestionScore;
}
