package com.mamdaero.domain.member.security.dto.request;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDTO
{
    private String currentPassword;
    private String newPassword;
}
