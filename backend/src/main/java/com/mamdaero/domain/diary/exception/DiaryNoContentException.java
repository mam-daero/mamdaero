package com.mamdaero.domain.diary.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class DiaryNoContentException extends CustomException {

    private static final long serialVersionUID = 1L;

    public DiaryNoContentException() {
        super(DiaryExceptionConstants.DIARY_NO_CONTENT);
    }
}
