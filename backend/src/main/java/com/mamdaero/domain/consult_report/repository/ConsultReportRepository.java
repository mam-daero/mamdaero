package com.mamdaero.domain.consult_report.repository;

import com.mamdaero.domain.consult_report.dto.response.ConsultReportDetailResponse;
import com.mamdaero.domain.consult_report.dto.response.ConsultReportListResponse;
import com.mamdaero.domain.consult_report.entity.ConsultReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultReportRepository extends JpaRepository<ConsultReport, Long> {
    @Query(
            "SELECT new com.mamdaero.domain.consult_report.dto.response.ConsultReportListResponse(" +
                    "m.name, wt.date, wt.time, c.scriptUrl, c.summarizedScriptUrl, c.id," +
                    "CASE WHEN cr.id IS NULL THEN false ELSE true END " +
                    ") " +
                    "FROM Reservation r " +
                    "JOIN WorkTime wt ON r.workTimeId = wt.id " +
                    "JOIN Member m ON r.memberId = m.id " +
                    "JOIN Consult c ON r.id = c.id " +
                    "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
                    "LEFT JOIN ConsultReport cr ON c.id = cr.id " +
                    "WHERE r.memberId = :clientId AND ci.counselorId = :counselorId " +
                    "ORDER BY r.createdAt DESC"
    )
    Page<ConsultReportListResponse> findByClientIdAndCounselorId(@Param("clientId") Long clientId, @Param("counselorId") Long counselorId, Pageable pageable);

    @Query(
            "SELECT new com.mamdaero.domain.consult_report.dto.response.ConsultReportDetailResponse(" +
                    "cr.id, wt.date, wt.time, m.name, counselor.name, cr.title, cr.detail, cr.opinion " +
                    ") " +
                    "FROM Reservation r " +
                    "JOIN WorkTime wt ON r.workTimeId = wt.id " +
                    "JOIN Member m ON r.memberId = m.id " +
                    "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
                    "JOIN Counselor counselor ON ci.counselorId = counselor.id " +
                    "JOIN Consult c ON r.id = c.id " +
                    "JOIN ConsultReport cr ON c.id = cr.id " +
                    "WHERE cr.id = :reportId")
    ConsultReportDetailResponse findReport(@Param("reportId") Long reportId);

}
