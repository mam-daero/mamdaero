package com.mamdaero.domain.member.security.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberSignUpDTO
{
    private String email;
    private String password;
    private String name;
    private String nickname;
    private LocalDate birth;
    private String tel;
    private String gender;
    private String role;
}
