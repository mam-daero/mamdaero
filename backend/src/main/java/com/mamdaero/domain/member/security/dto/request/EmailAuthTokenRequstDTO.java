package com.mamdaero.domain.member.security.dto.request;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailAuthTokenRequstDTO
{
    private String email;
    private String auth_token;
}
