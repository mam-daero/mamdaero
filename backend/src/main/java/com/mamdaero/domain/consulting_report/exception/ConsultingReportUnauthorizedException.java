package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ConsultingReportUnauthorizedException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ConsultingReportUnauthorizedException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_UNAUTHORIZED);
    }
}
