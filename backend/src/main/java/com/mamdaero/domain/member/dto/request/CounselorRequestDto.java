package com.mamdaero.domain.member.dto.request;

import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselorRequestDto {

    private String intro;
    private String introDetail;
    private String img;
}
