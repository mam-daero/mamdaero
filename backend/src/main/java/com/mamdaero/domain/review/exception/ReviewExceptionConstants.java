package com.mamdaero.domain.review.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ReviewExceptionConstants implements ExceptionConstants {

    REVIEW_NOT_FOUND("R001", HttpStatus.NOT_FOUND),
    REVIEW_BAD_REQUEST("R002", HttpStatus.BAD_REQUEST),
    REVIEW_NO_REVIEW("R003", HttpStatus.BAD_REQUEST),
    REVIEW_NO_SCORE("R004", HttpStatus.BAD_REQUEST),
    REVIEW_ALREADY_EXIST("R005", HttpStatus.BAD_REQUEST);

    private final String code;
    private final HttpStatus status;
}
