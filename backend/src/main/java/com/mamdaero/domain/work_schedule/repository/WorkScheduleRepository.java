package com.mamdaero.domain.work_schedule.repository;

import com.mamdaero.domain.work_schedule.entity.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
    List<WorkSchedule> findByCounselorIdAndDay(Long counselorId, Integer day);

}
