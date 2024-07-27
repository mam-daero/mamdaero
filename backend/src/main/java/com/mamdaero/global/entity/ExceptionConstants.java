package com.mamdaero.global.entity;

import org.springframework.http.HttpStatus;

public interface ExceptionConstants {

    String getCode();
    HttpStatus getStatus();
}
