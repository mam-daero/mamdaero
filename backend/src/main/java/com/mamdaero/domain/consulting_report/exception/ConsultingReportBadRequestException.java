package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ConsultingReportBadRequestException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ConsultingReportBadRequestException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_BAD_REQUEST);
    }
}
