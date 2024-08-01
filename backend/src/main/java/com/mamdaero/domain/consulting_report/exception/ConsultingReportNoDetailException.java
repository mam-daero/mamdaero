package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

import java.io.Serial;

public class ConsultingReportNoDetailException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultingReportNoDetailException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_NO_DETAIL);
    }
}
