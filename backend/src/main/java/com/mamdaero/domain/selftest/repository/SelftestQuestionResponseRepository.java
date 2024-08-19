package com.mamdaero.domain.selftest.repository;

import com.mamdaero.domain.selftest.entity.SelftestQuestionResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SelftestQuestionResponseRepository extends JpaRepository<SelftestQuestionResponse, Integer> {

    @Query("SELECT SUM(s.selftestMemberQuestionScore) FROM SelftestQuestionResponse s WHERE s.memberSelftestList.id = :memberSelftestListId")
    Integer findTotalScoreByMemberSelftestListId(@Param("memberSelftestListId") Integer memberSelftestListId);
}
