package com.mamdaero.domain.counselor_board.repository;

import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CounselorBoardRepository extends JpaRepository<CounselorBoard, Long> {
    boolean existsByIdAndMemberId(Long id, Long memberId);
    Page<CounselorBoard> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<CounselorBoard> findAllByOrderByCreatedAt(Pageable pageable);

    @Query("SELECT b FROM CounselorBoard b " +
            "LEFT JOIN CounselorBoardLike l ON b.id = l.boardId " +
            "GROUP BY b.id " +
            "ORDER BY COUNT(l.id) DESC, b.createdAt DESC")
    Page<CounselorBoard> findAllOrderedByLikes(Pageable pageable);

    @Query("SELECT b FROM CounselorBoard b " +
            "LEFT JOIN CounselorBoardComment l ON b.id = l.boardId " +
            "GROUP BY b.id " +
            "ORDER BY COUNT(l.id) DESC, b.createdAt DESC")
    Page<CounselorBoard> findAllOrderedByComment(Pageable pageable);

    @Query("SELECT b FROM CounselorBoard b " +
            "WHERE b.title LIKE %:search%")
    Page<CounselorBoard> findByTitle(@Param("search") String search, Pageable pageable);

    @Query("SELECT b FROM CounselorBoard b " +
            "WHERE b.content LIKE %:search%")
    Page<CounselorBoard> findByContent(@Param("search") String search, Pageable pageable);

    @Query("SELECT b FROM CounselorBoard b " +
            "LEFT JOIN Member m ON b.memberId = m.id " +
            "WHERE m.name LIKE %:search%")
    Page<CounselorBoard> findByMemberName(@Param("search") String search, Pageable pageable);
}