package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CounselorBoardCommentRepository extends JpaRepository<CounselorBoardComment, Long>  {
    Page<CounselorBoardComment> findByBoardId(Long boardId, Pageable pageable);
    Optional<CounselorBoardComment> findByIdAndBoardIdAndMemberId(Long id, Long boardId, Long memberId);
    boolean existsByIdAndMemberId(Long id, Long memberId);
    Optional<CounselorBoardComment> findFirstByBoardIdOrderByCreatedAtDesc(Long id);
    Optional<CounselorBoardComment> findByIdAndBoardId(Long commentId, Long boardId);
}
