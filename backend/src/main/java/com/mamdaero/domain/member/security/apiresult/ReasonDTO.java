package com.mamdaero.domain.member.security.apiresult;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Builder
public class ReasonDTO
{
    private HttpStatus httpStatus;
    private final Boolean isSuccess;
    private final String code;
    private final String message;

    public Boolean getIsSuccess()
    {
        return isSuccess;
    }
}