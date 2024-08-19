package com.mamdaero.domain.work_schedule.controller;

import com.mamdaero.domain.work_schedule.dto.request.WorkTimeRequest;
import com.mamdaero.domain.work_schedule.dto.response.WorkTimeResponse;
import com.mamdaero.domain.work_schedule.service.WorkTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class WorkTimeController {

    private final WorkTimeService workTimeService;

    /**
     * 상담사 근무시간 상태 변경
     */
    @PatchMapping("/c/counselor/worktime")
    public void update(@RequestBody List<WorkTimeRequest> workTimeRequestList) {
        workTimeService.update(workTimeRequestList);
    }

    /**
     * 상담사 근무시간 조회
     */
    @GetMapping("/p/counselor/{counselorId}/worktime")
    public List<WorkTimeResponse> getWorkTime(@PathVariable(name = "counselorId") Long counselorId, @RequestParam(name = "date") LocalDate date) {
        return workTimeService.getWorkTime(counselorId, date);
    }

}
