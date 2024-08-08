package com.mamdaero.domain.member.security.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class IsDuplicateDTO
{
    private Boolean isDuplicate;
}
