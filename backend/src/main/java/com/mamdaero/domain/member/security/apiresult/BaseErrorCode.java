package com.mamdaero.domain.member.security.apiresult;

public interface BaseErrorCode
{
    public ErrorReasonDTO getReason();
    public ErrorReasonDTO getReasonHttpStatus();
}