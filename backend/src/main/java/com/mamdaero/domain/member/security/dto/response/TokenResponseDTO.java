package com.mamdaero.domain.member.security.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponseDTO
{
    private String access_token;
    private String refresh_token;
    private String message;
}
