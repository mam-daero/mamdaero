package com.mamdaero.domain.work_schedule.exception;

import com.mamdaero.global.exception.ExceptionConstants;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum WorkScheduleExceptionConstants implements ExceptionConstants {

    WORK_SCHEDULE_NOT_FOUND("SCD001", HttpStatus.NOT_FOUND),
    INVALID_TIME("SCD002", HttpStatus.BAD_REQUEST),
    INVALID_DAY("SCD003", HttpStatus.BAD_REQUEST),
    CAN_NOT_DELETE_WORK_SCHEDULE("SCD004", HttpStatus.BAD_REQUEST),
    CONFLICT_WORK_SCHEDULE("SCD005", HttpStatus.BAD_REQUEST),
    WORK_TIME_NOT_FOUND("SCD006", HttpStatus.NOT_FOUND);

    private final String code;
    private final HttpStatus status;
}
