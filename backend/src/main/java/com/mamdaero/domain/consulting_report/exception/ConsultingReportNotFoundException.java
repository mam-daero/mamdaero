package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultingReportNotFoundException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultingReportNotFoundException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_NOT_FOUND);
    }
}
