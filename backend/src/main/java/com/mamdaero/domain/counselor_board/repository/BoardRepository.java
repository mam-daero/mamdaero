package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<CounselorBoard, Long> {
    boolean existsByIdAndMemberId(Long id, Long memberId);
}