package com.mamdaero.domain.selftest.repository;

import com.mamdaero.domain.selftest.entity.SelftestQuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelftestQuestionOptionRepository extends JpaRepository<SelftestQuestionOption, Integer> {
}