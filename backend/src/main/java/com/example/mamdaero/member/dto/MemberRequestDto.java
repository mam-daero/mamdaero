package com.example.mamdaero.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MemberRequestDto {
    private String nickname;
    private Date birth;
    private String tel;
}
