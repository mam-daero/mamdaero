package com.mamdaero.domain.member.security.apiresult.exception;

import org.springframework.http.HttpStatus;

public interface BaseExceptionType
{
    int getErrorCode();
    HttpStatus getHttpStatus();
    String getErrorMessage();
}