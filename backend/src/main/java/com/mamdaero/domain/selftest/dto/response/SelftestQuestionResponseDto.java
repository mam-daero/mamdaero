package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.SelftestQuestion;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class SelftestQuestionResponseDto {
    private Integer id;
    private String selftestQuestionDetail;
    private List<SelftestQuestionOptionResponseDto> options;

    public static SelftestQuestionResponseDto toDTO(SelftestQuestion selftestQuestion) {
        return SelftestQuestionResponseDto.builder()
                .id(selftestQuestion.getId())
                .selftestQuestionDetail(selftestQuestion.getSelftestQuestionDetail())
                .options(selftestQuestion.getSelftestQuestionOptionList().stream()
                        .map(SelftestQuestionOptionResponseDto::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}