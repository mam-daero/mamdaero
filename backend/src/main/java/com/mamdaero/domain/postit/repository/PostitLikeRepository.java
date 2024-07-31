package com.mamdaero.domain.postit.repository;

import com.mamdaero.domain.postit.entity.PostitLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostitLikeRepository extends JpaRepository<PostitLike, Long>  {
    Integer countByBoardId(Long postitId);
    boolean existsByBoardIdAndMemberId(Long id, Long memberId);
}
