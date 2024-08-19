package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.MemberSelftestList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberSelftestResponseDto {
    private Integer memberSelfTestId;
    private String selftestName;
    private Integer selftestTotalScore;
    private List<SelftestQuestionResponseResponseDto> selftestResponseResDtos;

    public static MemberSelftestResponseDto toDTO(MemberSelftestList memberSelftestList) {
        return MemberSelftestResponseDto.builder()
                .memberSelfTestId(memberSelftestList.getId())
                .selftestName(memberSelftestList.getSelftest().getSelftestName())
                .selftestTotalScore(memberSelftestList.getSelftestTotalScore())
                .selftestResponseResDtos(memberSelftestList.getSelftestQuestionResponses().stream()
                        .map(SelftestQuestionResponseResponseDto::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}
