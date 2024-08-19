package com.mamdaero.domain.notice.repository;

import com.mamdaero.domain.notice.entity.Notice;
import com.mamdaero.domain.postit.entity.Postit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT b FROM Notice b " +
            "WHERE b.title LIKE %:search% " +
            "ORDER BY b.createdAt DESC")
    Page<Notice> findByTitle(@Param("search") String search, Pageable pageable);

    Page<Notice> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
