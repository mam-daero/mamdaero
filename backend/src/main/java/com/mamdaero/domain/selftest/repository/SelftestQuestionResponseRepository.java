package com.mamdaero.domain.selftest.repository;

import com.mamdaero.domain.selftest.entity.SelftestQuestionResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelftestQuestionResponseRepository extends JpaRepository<SelftestQuestionResponse, Integer> {
}