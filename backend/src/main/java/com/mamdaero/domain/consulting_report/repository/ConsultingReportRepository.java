package com.mamdaero.domain.consulting_report.repository;

import com.mamdaero.domain.consulting_report.entity.ConsultingReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultingReportRepository extends JpaRepository<ConsultingReport, Long> {
}
