package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardLikeRepository  extends JpaRepository<CounselorBoardLike, Long>  {
    CounselorBoardLike findByBoardIdAndMemberId(Long boardId, Long memberId);
}