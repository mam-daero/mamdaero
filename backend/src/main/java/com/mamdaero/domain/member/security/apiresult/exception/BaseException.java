package com.mamdaero.domain.member.security.apiresult.exception;

public abstract class BaseException extends RuntimeException
{
    public abstract BaseExceptionType getExceptionType();
}