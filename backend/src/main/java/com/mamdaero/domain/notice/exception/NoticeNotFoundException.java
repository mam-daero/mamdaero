package com.mamdaero.domain.notice.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class NoticeNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public NoticeNotFoundException() {
        super(NoticeExceptionConstants.NOTICE_NOT_FOUND);
    }
}
