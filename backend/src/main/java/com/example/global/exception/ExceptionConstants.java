package com.example.global.exception;

import org.springframework.http.HttpStatus;

public interface ExceptionConstants {

    String getCode();
    HttpStatus getStatus();
}
