package com.mamdaero.domain.selftest.repository;

import com.mamdaero.domain.selftest.entity.SelftestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SelftestQuestionRepository extends JpaRepository<SelftestQuestion, Integer> {

    @Query("SELECT q FROM SelftestQuestion q LEFT JOIN FETCH q.selftestQuestionOptionList WHERE q.selftest.id = :selftestId")
    List<SelftestQuestion> findBySelftestIdWithOptions(@Param("selftestId") Integer selftestId);
}