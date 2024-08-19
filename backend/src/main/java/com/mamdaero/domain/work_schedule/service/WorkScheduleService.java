package com.mamdaero.domain.work_schedule.service;

import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.work_schedule.dto.request.WorkScheduleRequest;
import com.mamdaero.domain.work_schedule.dto.response.WorkScheduleResponse;
import com.mamdaero.domain.work_schedule.entity.WorkSchedule;
import com.mamdaero.domain.work_schedule.entity.WorkTime;
import com.mamdaero.domain.work_schedule.exception.*;
import com.mamdaero.domain.work_schedule.repository.WorkScheduleRepository;
import com.mamdaero.domain.work_schedule.repository.WorkTimeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.jdbc.Work;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class WorkScheduleService {
    private final WorkScheduleRepository workScheduleRepository;
    private final WorkTimeRepository workTimeRepository;
    private final FindUserService findUserService;
    /**
     * 상담사의 근무 일정 조회
     */
    public List<WorkScheduleResponse> find(int day) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        return workScheduleRepository.findByCounselorIdAndDay(member.getMemberId(), day).stream()
                .map(WorkScheduleResponse::toDTO)
                .toList();
    }

    /**
     * 상담사의 근무 일정 등록
     */
    @Transactional
    public boolean create(List<WorkScheduleRequest> workScheduleRequestList) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }


        // 유효한 요일인지 확인
        for (WorkScheduleRequest request : workScheduleRequestList) {
            if (request.getDay() == null || request.getDay() < 1 || request.getDay() > 7) {
                throw new InvalidDayException();
            }
        }

        // 유효한 근무 시간인지 확인
        for (WorkScheduleRequest request : workScheduleRequestList) {
            if (request.getStartTime() == null || request.getEndTime() == null ||
                    request.getStartTime() < 0 || 23 < request.getStartTime() ||
                    request.getEndTime() < 1 || 24 < request.getEndTime() ||
                    request.getStartTime() >= request.getEndTime()) {
                throw new InvalidTimeException();
            }
        }

        // 다른 근무 일정과 겹치는지 확인
        for (WorkScheduleRequest request : workScheduleRequestList) {
            List<WorkSchedule> workSchedules = workScheduleRepository.findByCounselorIdAndDay(member.getMemberId(), request.getDay());
            for (WorkSchedule workSchedule : workSchedules) {
                if (workSchedule.getStartTime() < request.getEndTime() &&
                        request.getStartTime() < workSchedule.getEndTime()) {
                    throw new ConflictWorkScheduleException();
                }
            }
        }


        List<WorkSchedule> workSchedules = new ArrayList<>();
        for (WorkScheduleRequest request : workScheduleRequestList) {
            workSchedules.add(WorkSchedule.builder()
                    .counselorId(member.getMemberId())
                    .day(request.getDay())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .build());
        }

        // 근무 일정 등록
        workScheduleRepository.saveAll(workSchedules);


        // 근무
        for (WorkSchedule workSchedule : workSchedules) {
            work(workSchedule);
        }

        return true;
    }

    /**
     * 상담사의 근무 일정 수정
     */

    @Transactional
    public WorkScheduleResponse update(Long id, WorkScheduleRequest request) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }


        Optional<WorkSchedule> findWorkSchedule = workScheduleRepository.findById(id);
        // 존재하는 근무 일정인지 확인
        if (findWorkSchedule.isEmpty()) {
            throw new WorkScheduleNotFoundException();
        }

        WorkSchedule workSchedule = findWorkSchedule.get();

        // 유효한 근무 시간인지 확인
        if (request.getStartTime() < 0 || 23 < request.getStartTime() ||
                request.getEndTime() < 1 || 24 < request.getEndTime() ||
                request.getStartTime() >= request.getEndTime()) {
            throw new InvalidTimeException();
        }


        // 다른 근무 일정과 겹치는지 확인
        List<WorkSchedule> workSchedules = workScheduleRepository.findByCounselorIdAndDay(member.getMemberId(), request.getDay());
        for (WorkSchedule otherSchedule : workSchedules) {
            if (otherSchedule.getStartTime() < request.getEndTime() &&
                    request.getStartTime() < otherSchedule.getEndTime()) {
                throw new ConflictWorkScheduleException();
            }
        }

        // 변경 전 근무 취소
        cancelWork(workSchedule);

        // 근무 일정 수정
        workSchedule.update(request);

        // 변경 후 근무
        work(workSchedule);


        return WorkScheduleResponse.toDTO(workSchedule);
    }

    /**
     * 상담사의 근무 일정 삭제
     */
    @Transactional
    public Boolean delete(Long id) {

        MemberInfoDTO member = findUserService.findMember();
        if(member == null || !member.getMemberRole().equals("상담사")) {
            throw new AccessDeniedException();
        }

        // 존재하는 근무 일정인지 확인
        if (!workScheduleRepository.existsById(id)) {
            throw new WorkScheduleNotFoundException();
        }

        // 예약된 근무 시간이 있는지 확인
        if (hasReservation(workScheduleRepository.findById(id).get())) {
            throw new CanNotDeleteWorkScheduleException();
        }

        // 해당 일정에 근무 시간 취소
        cancelWork(workScheduleRepository.findById(id).orElseThrow());

        // 근무 일정 삭제
        workScheduleRepository.deleteById(id);
        return true;
    }

    private boolean hasReservation(WorkSchedule workSchedule) {
        List<WorkTime> workTimes = workTimeRepository.findByCounselorId(workSchedule.getCounselorId());
        for (WorkTime workTime : workTimes) {
            if (workTime.getDate().getDayOfWeek().getValue() == workSchedule.getDay() &&
                    workSchedule.getStartTime() <= workTime.getTime() &&
                    workTime.getTime() < workSchedule.getEndTime()) {
                if (workTime.getIsReserved()) {
                    return true;
                }
            }
        }
        return false;
    }

    private void cancelWork(WorkSchedule workSchedule) {
        List<WorkTime> workTimes = workTimeRepository.findAll();
        for (WorkTime workTime : workTimes) {
            if (workTime.getDate().getDayOfWeek().getValue() == workSchedule.getDay() &&
                    workSchedule.getStartTime() <= workTime.getTime() &&
                    workTime.getTime() < workSchedule.getEndTime()) {
                workTime.cancelWork();
            }
        }
    }

    private void work(WorkSchedule workSchedule) {
        List<WorkTime> workTimes = workTimeRepository.findAll();
        for (WorkTime workTime : workTimes) {
            if (workTime.getDate().getDayOfWeek().getValue() == workSchedule.getDay() &&
                    workSchedule.getStartTime() <= workTime.getTime() &&
                    workTime.getTime() < workSchedule.getEndTime()) {
                workTime.work();
            }
        }
    }

}
