package com.mamdaero.domain.member.security.dto.request;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordEmailResetDTO
{
    private String email;
    private String password;
}
