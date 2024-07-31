package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ConsultingReportNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ConsultingReportNotFoundException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_NOT_FOUND);
    }
}
