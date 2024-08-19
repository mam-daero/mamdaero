package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.MemberSelftestList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberSelftestResultResponseDto {
    private Integer memberSelfTestId;
    private String selftestName;
    private Integer selftestTotalScore;
    private LocalDate memberSelftestDate;

    public static MemberSelftestResultResponseDto toDTO(MemberSelftestList memberSelftestList) {
        return MemberSelftestResultResponseDto.builder()
                .memberSelfTestId(memberSelftestList.getId())
                .selftestName(memberSelftestList.getSelftest().getSelftestName())
                .selftestTotalScore(memberSelftestList.getSelftestTotalScore())
                .memberSelftestDate(memberSelftestList.getMemberSelftestDate().toLocalDate())
                .build();
    }
}
