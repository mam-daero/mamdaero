package com.mamdaero.domain.diary.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class DiaryNoContentException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public DiaryNoContentException() {
        super(DiaryExceptionConstants.DIARY_NO_CONTENT);
    }
}
