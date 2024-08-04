package com.mamdaero.domain.reservation.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class InvalidSymptomException extends CustomException {
    public InvalidSymptomException() {
        super(ReservationExceptionConstants.INVALID_SYMPTOM);
    }
}
