package com.mamdaero.domain.consult_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultReportAlreadyExistException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultReportAlreadyExistException() {
        super(ConsultReportExceptionConstants.CONSULT_REPORT_ALREADY_EXIST);
    }
}
