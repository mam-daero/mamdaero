package com.mamdaero.domain.global.exception;

import org.springframework.http.HttpStatus;

public interface ExceptionConstants {

    String getCode();

    HttpStatus getStatus();
}
