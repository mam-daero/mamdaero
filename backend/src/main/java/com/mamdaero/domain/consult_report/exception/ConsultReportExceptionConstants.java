package com.mamdaero.domain.consult_report.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ConsultReportExceptionConstants implements ExceptionConstants {

    CONSULT_REPORT_NOT_FOUND("CR001", HttpStatus.NOT_FOUND),
    CONSULT_REPORT_BAD_REQUEST("CR002", HttpStatus.BAD_REQUEST),
    CONSULT_REPORT_UNAUTHORIZED("CR003", HttpStatus.UNAUTHORIZED),
    CONSULT_REPORT_NO_TITLE("CR004", HttpStatus.BAD_REQUEST),
    CONSULT_REPORT_NO_DETAIL("CR005", HttpStatus.BAD_REQUEST),
    CONSULT_REPORT_ALREADY_EXIST("CR006", HttpStatus.BAD_REQUEST);

    private final String code;
    private final HttpStatus status;
}
