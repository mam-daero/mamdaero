package com.mamdaero.domain.member.security.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberSignUpResponseDTO
{
    private String email;
    private Boolean isSuccess;
}
