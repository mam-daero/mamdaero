package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultingReportUnauthorizedException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultingReportUnauthorizedException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_UNAUTHORIZED);
    }
}
