package com.mamdaero.domain.postit.repository;

import com.mamdaero.domain.postit.entity.Postit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoistitRepository extends JpaRepository<Postit, Long> {
    List<Postit> findByQuestionId(Long questionId);
    Optional<Postit> findByQuestionIdAndIdAndMemberId(Long questionId, Long postitId, Long memberId);
    boolean existsByIdAndMemberId(Long id, Long memberId);
}
