package com.mamdaero.domain.work_schedule.repository;

import com.mamdaero.domain.work_schedule.dto.response.WorkTimeResponse;
import com.mamdaero.domain.work_schedule.entity.WorkTime;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM WorkTime w WHERE w.date < :date AND w.isReserved = false")
    void deleteByDateBeforeAndNotIsReserved(@Param("date") LocalDate date);

    List<WorkTime> findByCounselorId(Long counselorId);


    @Query("SELECT new com.mamdaero.domain.work_schedule.dto.response.WorkTimeResponse(w.id, w.counselorId, w.date,w.time, w.isReserved, w.isWorkTime) " +
            "FROM WorkTime w WHERE w.counselorId = :counselorId AND w.date = :date " +
            "ORDER BY w.time ASC")
    List<WorkTimeResponse> findByCounselorIdAndDate(@Param("counselorId") Long counselorId, @Param("date") LocalDate date);
}