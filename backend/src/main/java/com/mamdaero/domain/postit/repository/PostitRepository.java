package com.mamdaero.domain.postit.repository;

import com.mamdaero.domain.postit.entity.Postit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostitRepository extends JpaRepository<Postit, Long> {
    Page<Postit> findByQuestionIdOrderByCreatedAtDesc(Long questionId, Pageable pageable);
    Optional<Postit> findByQuestionIdAndIdAndMemberId(Long questionId, Long postitId, Long memberId);
    boolean existsByIdAndMemberId(Long id, Long memberId);
}
