package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class InvalidTimeException extends CustomException {
    public InvalidTimeException() {
        super(WorkScheduleExceptionConstants.INVALID_TIME);
    }
}
