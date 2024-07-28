package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.global.exception.CustomException;

public class CanNotDeleteWorkScheduleException extends CustomException {
    public CanNotDeleteWorkScheduleException() {
        super(WorkScheduleExceptionConstants.CAN_NOT_DELETE_WORK_SCHEDULE);
    }
}
