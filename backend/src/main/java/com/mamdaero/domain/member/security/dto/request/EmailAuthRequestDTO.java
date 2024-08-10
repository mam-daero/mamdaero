package com.mamdaero.domain.member.security.dto.request;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailAuthRequestDTO
{
    private String email;
    private String counselorName;
    private String license;
}
