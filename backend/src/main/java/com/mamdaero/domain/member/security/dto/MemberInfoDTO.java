package com.mamdaero.domain.member.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberInfoDTO
{
    private Long memberId;
    private String memberEmail;
    private String memberRole;
}
