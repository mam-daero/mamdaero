package com.example.mamdaero.work_schedule.repository;

import com.example.mamdaero.work_schedule.entity.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
    public List<WorkSchedule> findByIdAndDay(Long counselorId, Integer day);
}
