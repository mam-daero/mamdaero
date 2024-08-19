package com.mamdaero.domain.reservation.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ReservationExceptionConstants implements ExceptionConstants {
    RESERVATION_NOT_FOUND("RES001", HttpStatus.NOT_FOUND),
    CAN_NOT_MAKE_RESERVATION("RES002", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_SYMPTOM("RES003", HttpStatus.BAD_REQUEST),
    INVALID_SITUATION("RES004", HttpStatus.BAD_REQUEST);

    private final String code;
    private final HttpStatus status;
}
