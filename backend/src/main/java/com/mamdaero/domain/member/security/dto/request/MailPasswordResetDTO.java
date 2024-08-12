package com.mamdaero.domain.member.security.dto.request;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MailPasswordResetDTO
{
    private String email;
    private String name;
}
