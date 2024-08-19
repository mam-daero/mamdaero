package com.mamdaero.domain.board.repository;

import com.mamdaero.domain.board.entity.BoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long>  {
    Page<BoardComment> findByBoardId(Long boardId, Pageable pageable);
    Optional<BoardComment> findByIdAndBoardIdAndMemberId(Long id, Long boardId, Long memberId);
    boolean existsByIdAndMemberId(Long id, Long memberId);
    Optional<BoardComment> findFirstByBoardIdOrderByCreatedAtDesc(Long id);
    Optional<BoardComment> findByIdAndBoardId(Long commentId, Long boardId);
}
