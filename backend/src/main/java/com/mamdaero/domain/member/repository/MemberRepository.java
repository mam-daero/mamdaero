package com.mamdaero.domain.member.repository;

import com.mamdaero.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
//    Optional<Member> findById(Long id);
}
