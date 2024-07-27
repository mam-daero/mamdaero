package com.example.mamdaero.counselor_item.exception;

import com.example.global.entity.CustomException;

public class CounselorItemNotFoundException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public CounselorItemNotFoundException() {
        super(CounselorItemExceptionConstants.COUNSELOR_ITEM_NOT_FOUND);
    }
}
