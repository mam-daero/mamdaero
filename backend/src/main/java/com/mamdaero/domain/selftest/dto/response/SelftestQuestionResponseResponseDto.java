package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.SelftestQuestionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SelftestQuestionResponseResponseDto {
    private Integer selftestQuestionResponseId;
    private Integer memberSelftestId;
    private String selftestQuestion;
    private Integer selftestMemberQuestionScore;
    private String selftestMemberQuestionAnswer;


    public static SelftestQuestionResponseResponseDto toDTO(SelftestQuestionResponse selftestQuestionResponse) {
        return SelftestQuestionResponseResponseDto.builder()
                .selftestQuestionResponseId(selftestQuestionResponse.getId())
                .memberSelftestId(selftestQuestionResponse.getMemberSelftestList().getId())
                .selftestQuestion(selftestQuestionResponse.getSelftestQuestion().getSelftestQuestionDetail())
                .selftestMemberQuestionScore(selftestQuestionResponse.getSelftestMemberQuestionScore())
                .selftestMemberQuestionAnswer(selftestQuestionResponse.getSelftestQuestionOption().getSelftestQuestionOptionDetail())
                .build();
    }
}
