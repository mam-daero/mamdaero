package com.example.mamdaero.member.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MemberResponseDto {
    private Integer id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private Date birth;
    private String tel;
    private String gender;
    private String role;
    private Boolean memberStatus;
    private String token;
}
