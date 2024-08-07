package com.mamdaero.domain.consult.exception;

import com.mamdaero.global.exception.CustomException;

public class ConsultNotFoundException extends CustomException {

    public ConsultNotFoundException() {
        super(ConsultExceptionConstants.CONSULT_NOT_FOUND);
    }
}
