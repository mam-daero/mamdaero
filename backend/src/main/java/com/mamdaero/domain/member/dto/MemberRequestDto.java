package com.mamdaero.domain.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MemberRequestDto {
    private String nickname;
    private LocalDate birth;
    private String tel;
}
