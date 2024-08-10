package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselorBoardFileRepository extends JpaRepository<CounselorBoardFile, Long> {
    List<CounselorBoardFile> findByBoardId(Long boardId);
}
