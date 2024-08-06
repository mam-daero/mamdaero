package com.mamdaero.domain.reservation.exception;

import com.mamdaero.global.exception.CustomException;

public class ReservationNotFoundException extends CustomException {

    public ReservationNotFoundException() {
        super(ReservationExceptionConstants.RESERVATION_NOT_FOUND);
    }
}
