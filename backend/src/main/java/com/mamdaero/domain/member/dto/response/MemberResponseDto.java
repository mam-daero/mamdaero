package com.mamdaero.domain.member.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


@Data
@Builder
public class MemberResponseDto {
    private Integer id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private LocalDate birth;
    private String tel;
    private String gender;
    private String role;
    private Boolean memberStatus;
    private String token;
}
