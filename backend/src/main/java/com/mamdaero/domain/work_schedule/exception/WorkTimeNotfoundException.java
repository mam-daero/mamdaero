package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.global.exception.CustomException;

public class WorkTimeNotfoundException extends CustomException {

    public WorkTimeNotfoundException() {
        super(WorkScheduleExceptionConstants.WORK_TIME_NOT_FOUND);
    }
}
