package com.mamdaero.domain.counselor_item.exception;

import com.mamdaero.global.entity.CustomException;

public class CounselorNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public CounselorNotFoundException() {
        super(CounselorItemExceptionConstants.COUNSELOR_NOT_FOUND);
    }
}
