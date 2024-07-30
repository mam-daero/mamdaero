package com.mamdaero.domain.notice.exception;

import com.mamdaero.domain.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NoticeExceptionConstants implements ExceptionConstants {

    NOTICE_NOT_FOUND("B001", HttpStatus.NOT_FOUND),
    NOTICE_BAD_REQUEST("B002", HttpStatus.BAD_REQUEST);

    private final String code;
    private final HttpStatus status;
}