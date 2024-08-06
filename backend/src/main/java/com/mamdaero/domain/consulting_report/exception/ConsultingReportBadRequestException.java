package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ConsultingReportBadRequestException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ConsultingReportBadRequestException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_BAD_REQUEST);
    }
}
