package com.mamdaero.domain.work_schedule.service;

import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.work_schedule.dto.request.WorkTimeRequest;
import com.mamdaero.domain.work_schedule.dto.response.WorkTimeResponse;
import com.mamdaero.domain.work_schedule.entity.WorkSchedule;
import com.mamdaero.domain.work_schedule.entity.WorkTime;
import com.mamdaero.domain.work_schedule.repository.WorkScheduleRepository;
import com.mamdaero.domain.work_schedule.repository.WorkTimeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkTimeService {
    private final WorkTimeRepository workTimeRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final FindUserService findUserService;


    /**
     * 상담사가 처음 등록될 때, 4주치의 근무 시간을 생성한다.
     */
    public void createInitialWorkTimes(Long counselorId) {
        LocalDate today = LocalDate.now();
        List<WorkTime> workTimes = new ArrayList<>();

        for (int i = 0; i < 28; i++) {
            LocalDate date = today.plusDays(i);
            for (int hour = 0; hour < 24; hour++) {
                workTimes.add(WorkTime.builder()
                        .counselorId(counselorId)
                        .date(date)
                        .time(hour)
                        .isReserved(false)
                        .isWorkTime(false)
                        .build());
            }
        }

        workTimeRepository.saveAll(workTimes);
    }

    @Scheduled(cron = "0 41 14 * * *")
    @Transactional
    public void updateWorkTimes() {
        LocalDate today = LocalDate.now();
        LocalDate dayToAdd = today.plusDays(27);


        // 어제 근무시간을 삭제한다.
        workTimeRepository.deleteByDateBeforeAndNotIsReserved(today);

        // TODO: 상담사레포지토리에서 모든 상담사ID 가져오기
        List<Long> counselorIds = new ArrayList<>();
        for (int i = 16; i <= 22; i++) {
            counselorIds.add((long) i);
        }

        int dayOfWeek = dayToAdd.getDayOfWeek().getValue();
        for (Long counselorId : counselorIds) {
            List<WorkSchedule> workSchedules = workScheduleRepository.findByCounselorIdAndDay(counselorId, dayOfWeek);
            List<WorkTime> newWorkTimes = new ArrayList<>();

            for (int hour = 0; hour < 24; hour++) {
                WorkTime workTime = WorkTime.builder()
                        .counselorId(counselorId)
                        .date(dayToAdd)
                        .time(hour)
                        .isReserved(false)
                        .isWorkTime(false)
                        .build();

                for (WorkSchedule schedule : workSchedules) {
                    if (hour >= schedule.getStartTime() && hour < schedule.getEndTime()) {
                        workTime.work();
                    }
                }

                newWorkTimes.add(workTime);
            }

            workTimeRepository.saveAll(newWorkTimes);
        }
    }

    @Transactional
    public void update(List<WorkTimeRequest> workTimeRequestList) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        for (WorkTimeRequest request : workTimeRequestList) {

            WorkTime workTime = workTimeRepository.findById(request.getWorkTimeId()).orElseThrow();
            if (request.getIsWorkTime()) {
                workTime.work();
            } else {
                workTime.cancelWork();
            }
        }
    }

    public List<WorkTimeResponse> getWorkTime(Long counselorId, LocalDate date) {
        return workTimeRepository.findByCounselorIdAndDate(counselorId, date);
    }
}
