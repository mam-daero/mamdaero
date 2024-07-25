package com.example.mamdaero.member.repository;

import com.example.mamdaero.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findById(Integer id);
}
