package com.mamdaero.domain.selftest.dto.response;

import com.mamdaero.domain.selftest.entity.Selftest;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SelftestResponseDto {
    private Integer id;
    private String selftestName;
    private String selftestInfo;

    public static SelftestResponseDto toDTO(Selftest selftest) {
        return SelftestResponseDto.builder()
                .id(selftest.getId())
                .selftestName(selftest.getSelftestName())
                .selftestInfo(selftest.getSelftestInfo())
                .build();
    }
}