package com.mamdaero.domain.diary.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class DiaryBadRequestException extends CustomException {

    private static final long serialVersionUID = 1L;

    public DiaryBadRequestException() {
        super(DiaryExceptionConstants.DIARY_BAD_REQUEST);
    }
}
