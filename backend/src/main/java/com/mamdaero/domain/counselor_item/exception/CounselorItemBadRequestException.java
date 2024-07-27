package com.mamdaero.domain.counselor_item.exception;

import com.mamdaero.global.entity.CustomException;

public class CounselorItemBadRequestException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public CounselorItemBadRequestException() {
        super(CounselorItemExceptionConstants.COUNSELOR_BAD_REQUEST);
    }
}