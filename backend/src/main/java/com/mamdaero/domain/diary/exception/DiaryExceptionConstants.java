package com.mamdaero.domain.diary.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum DiaryExceptionConstants implements ExceptionConstants {

    DIARY_NOT_FOUND("D001", HttpStatus.NOT_FOUND),
    DIARY_BAD_REQUEST("D002", HttpStatus.BAD_REQUEST),
    DIARY_NO_CONTENT("D003", HttpStatus.BAD_REQUEST),
    DIARY_NO_DATE("D004", HttpStatus.BAD_REQUEST);

    private final String code;
    private final HttpStatus status;
}
