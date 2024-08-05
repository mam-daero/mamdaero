package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.global.exception.CustomException;

public class WorkScheduleNotFoundException extends CustomException {
    public WorkScheduleNotFoundException() {
        super(WorkScheduleExceptionConstants.WORK_SCHEDULE_NOT_FOUND);
    }
}
