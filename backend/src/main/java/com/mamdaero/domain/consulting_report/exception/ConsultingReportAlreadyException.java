package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

import java.io.Serial;

public class ConsultingReportAlreadyException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultingReportAlreadyException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_ALREADY);
    }
}
