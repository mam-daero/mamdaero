package com.mamdaero.domain.consult.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ConsultExceptionConstants implements ExceptionConstants {

    CONSULT_NOT_FOUND("CONSULT001", HttpStatus.NOT_FOUND);


    private final String code;
    private final HttpStatus status;
}
