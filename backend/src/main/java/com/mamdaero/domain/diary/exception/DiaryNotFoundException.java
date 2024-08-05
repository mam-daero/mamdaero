package com.mamdaero.domain.diary.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class DiaryNotFoundException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DiaryNotFoundException() {
        super(DiaryExceptionConstants.DIARY_NOT_FOUND);
    }
}
