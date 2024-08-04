package com.mamdaero.domain.member.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class FileNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public FileNotFoundException() {
        super(MemberExceptionConstants.FILE_NOT_FOUND);
    }
}
