package com.mamdaero.domain.consult_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultReportBadRequestException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultReportBadRequestException() {
        super(ConsultReportExceptionConstants.CONSULT_REPORT_BAD_REQUEST);
    }
}
