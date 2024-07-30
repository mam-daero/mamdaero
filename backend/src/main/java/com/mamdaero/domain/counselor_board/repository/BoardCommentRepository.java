package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardCommentRepository extends JpaRepository<CounselorBoardComment, Long>  {
    List<CounselorBoardComment> findByBoardId(Long id);
    Optional<CounselorBoardComment> findByIdAndBoardIdAndMemberId(Long id, Long boardId, Long memberId);
}
