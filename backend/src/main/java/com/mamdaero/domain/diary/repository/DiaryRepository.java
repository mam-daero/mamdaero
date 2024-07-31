package com.mamdaero.domain.diary.repository;

import com.mamdaero.domain.diary.entity.Diary;
import com.mamdaero.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findDiaryByMember(Member member);

}
