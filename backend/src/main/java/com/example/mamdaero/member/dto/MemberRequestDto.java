package com.example.mamdaero.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class MemberRequestDto {
    private String nickname;
    private LocalDate birth;
    private String tel;
}
