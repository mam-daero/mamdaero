package com.mamdaero.domain.member.exception;

import com.mamdaero.global.exception.CustomException;

public class AccessDeniedException extends CustomException {

    private static final long serialVersionUID = 1L;

    public AccessDeniedException() {
        super(MemberExceptionConstants.ACCESS_DENIED);
    }
}