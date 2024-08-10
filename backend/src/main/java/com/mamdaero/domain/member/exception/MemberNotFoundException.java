package com.mamdaero.domain.member.exception;

import com.mamdaero.global.exception.CustomException;

public class MemberNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public MemberNotFoundException() {
        super(MemberExceptionConstants.MEMBER_NOT_FOUND);
    }
}
