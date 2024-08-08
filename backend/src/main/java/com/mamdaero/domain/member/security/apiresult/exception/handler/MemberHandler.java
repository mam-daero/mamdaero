package com.mamdaero.domain.member.security.apiresult.exception.handler;

import com.mamdaero.domain.member.security.apiresult.BaseErrorCode;
import com.mamdaero.domain.member.security.apiresult.exception.GeneralException;

public class MemberHandler extends GeneralException
{
    public MemberHandler(BaseErrorCode errorCode)
    {
        super(errorCode);
    }
}
