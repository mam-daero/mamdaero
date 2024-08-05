package com.mamdaero.domain.reservation.exception;

import com.mamdaero.global.exception.CustomException;

public class InvalidSituationException extends CustomException {
    public InvalidSituationException() {
        super(ReservationExceptionConstants.INVALID_SITUATION);
    }
}
