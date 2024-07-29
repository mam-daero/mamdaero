package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ConflictWorkScheduleException extends CustomException {
    public ConflictWorkScheduleException() {
        super(WorkScheduleExceptionConstants.CONFLICT_WORK_SCHEDULE);
    }
}
