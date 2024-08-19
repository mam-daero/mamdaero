package com.mamdaero.domain.member.security.apiresult.exception;

import com.mamdaero.domain.member.security.apiresult.BaseErrorCode;
import com.mamdaero.domain.member.security.apiresult.ErrorReasonDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GeneralException extends RuntimeException
{
    private BaseErrorCode code;

    public ErrorReasonDTO getErrorReason()
    {
        return this.code.getReason();
    }

    public ErrorReasonDTO getErrorReasonHttpStatus()
    {
        return this.code.getReasonHttpStatus();
    }
}