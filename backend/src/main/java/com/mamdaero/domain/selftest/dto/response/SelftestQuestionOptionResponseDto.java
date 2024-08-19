package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.SelftestQuestionOption;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SelftestQuestionOptionResponseDto {
    private Integer id;
    private String selftestQuestionOptionDetail;
    private Integer selftestQuestionOptionScore;

    public static SelftestQuestionOptionResponseDto toDTO(SelftestQuestionOption selftestQuestionOption) {
        return SelftestQuestionOptionResponseDto.builder()
                .id(selftestQuestionOption.getId())
                .selftestQuestionOptionDetail(selftestQuestionOption.getSelftestQuestionOptionDetail())
                .selftestQuestionOptionScore(selftestQuestionOption.getSelftestQuestionOptionScore())
                .build();
    }
}