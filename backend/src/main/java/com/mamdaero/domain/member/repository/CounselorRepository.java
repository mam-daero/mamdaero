package com.mamdaero.domain.member.repository;

import com.mamdaero.domain.member.entity.Counselor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselorRepository extends JpaRepository<Counselor, Long> {

    List<Counselor> findAllByNameContains(String counselorName);
}
