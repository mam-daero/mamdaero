package com.mamdaero.domain.board.repository;

import com.mamdaero.domain.board.entity.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long>  {
    BoardLike findByBoardIdAndMemberId(Long boardId, Long memberId);
    boolean existsByBoardIdAndMemberId(Long id, Long memberId);
    int countByBoardId(Long id);
}