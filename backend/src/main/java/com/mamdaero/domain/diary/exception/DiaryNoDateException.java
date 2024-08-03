package com.mamdaero.domain.diary.exception;

import com.mamdaero.domain.global.exception.CustomException;

import java.io.Serial;

public class DiaryNoDateException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DiaryNoDateException() {
        super(DiaryExceptionConstants.DIARY_NO_DATE);
    }
}
