package com.mamdaero.domain.consult_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultReportNoTitleException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultReportNoTitleException() {
        super(ConsultReportExceptionConstants.CONSULT_REPORT_NO_TITLE);
    }
}
