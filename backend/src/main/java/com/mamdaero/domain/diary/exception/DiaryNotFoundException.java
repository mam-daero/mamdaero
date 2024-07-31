package com.mamdaero.domain.diary.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class DiaryNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public DiaryNotFoundException() {
        super(DiaryExceptionConstants.DIARY_NOT_FOUND);
    }
}
