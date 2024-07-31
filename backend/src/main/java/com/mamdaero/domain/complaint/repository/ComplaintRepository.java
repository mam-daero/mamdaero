package com.mamdaero.domain.complaint.repository;

import com.mamdaero.domain.complaint.entity.Complaint;
import com.mamdaero.domain.complaint.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    boolean existsByMemberIdAndEventSourceAndEventId(Long memberId, Source eventSource, Long eventId);
}