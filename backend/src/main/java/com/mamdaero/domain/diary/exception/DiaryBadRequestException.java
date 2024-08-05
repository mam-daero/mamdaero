package com.mamdaero.domain.diary.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class DiaryBadRequestException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DiaryBadRequestException() {
        super(DiaryExceptionConstants.DIARY_BAD_REQUEST);
    }
}
