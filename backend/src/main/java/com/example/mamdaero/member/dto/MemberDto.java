package com.example.mamdaero.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MemberDto {
    private String nickname;
    private Date birth;
    private String tel;
}
