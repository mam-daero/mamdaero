package com.mamdaero.domain.reservation.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class CanNotMakeReservationException extends CustomException {

    public CanNotMakeReservationException() {
        super(ReservationExceptionConstants.CAN_NOT_MAKE_RESERVATION);
    }
}
