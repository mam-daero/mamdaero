package com.mamdaero.domain.member.dto.response;

import com.mamdaero.domain.member.entity.Counselor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CounselorResponseDto {
    private Long id;
    private String name;
    private String tel;
    private String gender;
    private Integer level;
    private String license;
    private String intro;
    private String introDetail;
    private String img;
    private Long reviewCount;
    private Double reviewRate;

    public CounselorResponseDto(Long id, String name, String tel, String gender,
                                Integer level, String license, String intro, String introDetail, String img, Long reviewCount, Double reviewRate) {
        this.id = id;
        this.name = name;
        this.tel = tel;
        this.gender = gender;
        this.level = level;
        this.license = license;
        this.intro = intro;
        this.introDetail = introDetail;
        this.img = img;
        this.reviewCount = reviewCount;
        if (reviewRate != null) {
            this.reviewRate = Math.round(reviewRate * 100.0) / 100.0;
        } else {
            this.reviewRate = 0.0;
        }
    }

    public static CounselorResponseDto toDTO(Counselor counselor) {
        return CounselorResponseDto.builder()
                .id(counselor.getId())
                .name(counselor.getName())
                .tel(counselor.getTel())
                .gender(counselor.getGender())
                .level(counselor.getLevel())
                .license(counselor.getLicense())
                .intro(counselor.getIntro())
                .introDetail(counselor.getIntroDetail())
                .img(counselor.getImg())
                .build();
    }
}