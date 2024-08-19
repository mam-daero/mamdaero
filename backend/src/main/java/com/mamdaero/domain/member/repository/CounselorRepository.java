package com.mamdaero.domain.member.repository;

import com.mamdaero.domain.member.dto.response.CounselorResponseDto;
import com.mamdaero.domain.member.entity.Counselor;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CounselorRepository extends JpaRepository<Counselor, Long>, JpaSpecificationExecutor<Counselor> {

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Counselor SET img = :img WHERE id = :id")
    void updateProfileImg(@Param("img") String img, @Param("id") String id);

    @Query("SELECT new com.mamdaero.domain.member.dto.response.CounselorResponseDto(c.id, c.name, c.tel, c.gender, c.level, c.license, c.intro, c.introDetail, c.img, COUNT(r), AVG(r.score)) " +
            "FROM Counselor c " +
            "LEFT JOIN CounselorItem ci ON c.id = ci.counselorId " +
            "LEFT JOIN Reservation res ON ci.counselorItemId = res.counselorItemId " +
            "LEFT JOIN Review r ON res.id = r.id " +
            "WHERE c.id = :id " +
            "GROUP BY c.id")
    CounselorResponseDto findCounselorReviewSummaryById(@Param("id") Long id);

    @Query("SELECT new com.mamdaero.domain.member.dto.response.CounselorResponseDto(c.id, c.name, c.tel, c.gender, c.level, c.license, c.intro, c.introDetail, c.img, COUNT(r.id), AVG(r.score)) " +
            "FROM Counselor c " +
            "LEFT JOIN CounselorItem ci ON c.id = ci.counselorId " +
            "LEFT JOIN Reservation res ON ci.counselorItemId = res.counselorItemId " +
            "LEFT JOIN Review r ON res.id = r.id " +
            "WHERE (:name IS NULL OR c.name LIKE %:name%) " +
            "AND (:gender IS NULL OR c.gender = :gender) " +
            "AND (:level IS NULL OR c.level = :level) " +
            "AND c.memberStatus = FALSE " +
            "GROUP BY c.id")
    Page<CounselorResponseDto> searchCounselors(@Param("name") String name, @Param("gender") String gender, @Param("level") Integer level, Pageable pageable);

    @Query("SELECT new com.mamdaero.domain.member.dto.response.CounselorResponseDto(c.id, c.name, c.tel, c.gender, c.level, c.license, c.intro, c.introDetail, c.img, COUNT(r.id), AVG(r.score)) " +
            "FROM Counselor c " +
            "LEFT JOIN CounselorItem ci ON c.id = ci.counselorId " +
            "LEFT JOIN Reservation res ON ci.counselorItemId = res.counselorItemId " +
            "LEFT JOIN Review r ON res.id = r.id " +
            "WHERE (:name IS NULL OR c.name LIKE %:name%) " +
            "AND (:gender IS NULL OR c.gender = :gender) " +
            "AND (:level IS NULL OR c.level = :level) " +
            "AND c.memberStatus = FALSE " +
            "GROUP BY c.id " +
            "ORDER BY COUNT(r.id) DESC, c.name")
    Page<CounselorResponseDto> searchCounselorsOrderByReviewCount(@Param("name") String name, @Param("gender") String gender, @Param("level") Integer level, Pageable pageable);

    @Query("SELECT new com.mamdaero.domain.member.dto.response.CounselorResponseDto(c.id, c.name, c.tel, c.gender, c.level, c.license, c.intro, c.introDetail, c.img, COUNT(r.id), AVG(r.score)) " +
            "FROM Counselor c " +
            "LEFT JOIN CounselorItem ci ON c.id = ci.counselorId " +
            "LEFT JOIN Reservation res ON ci.counselorItemId = res.counselorItemId " +
            "LEFT JOIN Review r ON res.id = r.id " +
            "WHERE (:name IS NULL OR c.name LIKE %:name%) " +
            "AND (:gender IS NULL OR c.gender = :gender) " +
            "AND (:level IS NULL OR c.level = :level) " +
            "AND c.memberStatus = FALSE " +
            "GROUP BY c.id " +
            "ORDER BY AVG(r.score) DESC, c.name")
    Page<CounselorResponseDto> searchCounselorsOrderByReviewRating(@Param("name") String name, @Param("gender") String gender, @Param("level") Integer level, Pageable pageable);
}
