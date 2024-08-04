package com.mamdaero.domain.reservation.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class InvalidSituationException extends CustomException {
    public InvalidSituationException() {
        super(ReservationExceptionConstants.INVALID_SITUATION);
    }
}
