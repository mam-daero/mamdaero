package com.mamdaero.domain.diary.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class DiaryNoDateException extends CustomException {

    private static final long serialVersionUID = 1L;

    public DiaryNoDateException() {
        super(DiaryExceptionConstants.DIARY_NO_DATE);
    }
}
