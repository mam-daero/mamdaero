package com.mamdaero.domain.reservation.exception;

import com.mamdaero.global.exception.CustomException;

public class CanNotMakeReservationException extends CustomException {

    public CanNotMakeReservationException() {
        super(ReservationExceptionConstants.CAN_NOT_MAKE_RESERVATION);
    }
}
