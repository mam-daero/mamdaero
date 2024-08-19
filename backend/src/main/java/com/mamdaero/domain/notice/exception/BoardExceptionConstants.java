package com.mamdaero.domain.notice.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum BoardExceptionConstants implements ExceptionConstants {

    BOARD_NOT_FOUND("B001", HttpStatus.NOT_FOUND),
    BOARD_BAD_REQUEST("B002", HttpStatus.BAD_REQUEST),
    COMMENT_NOT_FOUND("B003", HttpStatus.NOT_FOUND);

    private final String code;
    private final HttpStatus status;
}
