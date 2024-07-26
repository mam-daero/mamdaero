package com.example.mamdaero.counselor_item.exception;

import com.example.mamdaero.global.exception.CustomException;

public class CounselorItemBadRequestException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public CounselorItemBadRequestException() {
        super(CounselorItemExceptionConstants.COUNSELOR_BAD_REQUEST);
    }
}