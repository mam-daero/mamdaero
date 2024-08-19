package com.mamdaero.domain.counselor_item.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CounselorItemExceptionConstants implements ExceptionConstants {

    COUNSELOR_NOT_FOUND("C001", HttpStatus.NOT_FOUND),
    COUNSELOR_BAD_REQUEST("C002", HttpStatus.BAD_REQUEST),
    COUNSELOR_ITEM_NOT_FOUND("C003", HttpStatus.NOT_FOUND);

    private final String code;
    private final HttpStatus status;
}
