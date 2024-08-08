package com.mamdaero.domain.member.security.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EmailCheckRequestDTO
{
    @NotEmpty
    private String email;
}