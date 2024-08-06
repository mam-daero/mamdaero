package com.mamdaero.domain.member.exception;

import com.mamdaero.global.exception.CustomException;

public class FileBadRequestException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public FileBadRequestException() {
        super(MemberExceptionConstants.FILE_BAD_REQUEST);
    }
}
