package com.mamdaero.domain.selftest.repository;

import com.mamdaero.domain.selftest.entity.Selftest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SelftestRepository extends JpaRepository<Selftest, Integer> {
}