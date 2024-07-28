package com.mamdaero.domain.notice.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class NoticeBadRequestException extends CustomException {

    private static final long serialVersionUID = 1L;

    public NoticeBadRequestException() {
        super(NoticeExceptionConstants.NOTICE_BAD_REQUEST);
    }
}
