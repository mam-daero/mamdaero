package com.mamdaero.domain.counselor_item.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class CounselorItemNotFoundException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public CounselorItemNotFoundException() {
        super(CounselorItemExceptionConstants.COUNSELOR_ITEM_NOT_FOUND);
    }
}
