package com.mamdaero.domain.diary.repository;

import com.mamdaero.domain.diary.entity.Diary;
import com.mamdaero.domain.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findDiaryByMember(Member member);

    Page<Diary> findDiaryByMember(Member member, Pageable pageable);

    List<Diary> findAllByMemberAndIsOpen(Member member, Boolean isOpen);

    Page<Diary> findAllByMemberAndIsOpen(Member member, Boolean isOpen, Pageable pageable);

    @Query("SELECT d FROM Diary d WHERE d.member = :member AND YEAR(d.date) = :year AND MONTH(d.date) = :month")
    Page<Diary> findAllByMemberAndDateYearAndDateMonth(@Param("member") Member member, @Param("year") int year, @Param("month") int month, Pageable pageable);
    @Query("SELECT d FROM Diary d WHERE d.member = :member AND YEAR(d.date) = :year AND MONTH(d.date) = :month AND d.isOpen = :isOpen")
    Page<Diary> findAllByMemberAndDateYearAndDateMonthAndIsOpen(@Param("member") Member member,
                                                                @Param("year") int year,
                                                                @Param("month") int month,
                                                                @Param("isOpen") Boolean isOpen,
                                                                Pageable pageable);
}
