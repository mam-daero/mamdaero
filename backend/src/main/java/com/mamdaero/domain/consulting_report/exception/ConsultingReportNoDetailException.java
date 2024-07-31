package com.mamdaero.domain.consulting_report.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ConsultingReportNoDetailException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ConsultingReportNoDetailException() {
        super(ConsultingReportExceptionConstants.CONSULTING_REPORT_NO_DETAIL);
    }
}
