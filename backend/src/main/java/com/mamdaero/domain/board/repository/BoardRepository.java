package com.mamdaero.domain.board.repository;

import com.mamdaero.domain.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {
    boolean existsByIdAndMemberId(Long id, Long memberId);
    Page<Board> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Board> findAllByOrderByCreatedAt(Pageable pageable);

    @Query("SELECT b FROM Board b " +
            "LEFT JOIN BoardLike l ON b.id = l.boardId " +
            "GROUP BY b.id " +
            "ORDER BY COUNT(l.id) DESC, b.createdAt DESC")
    Page<Board> findAllOrderedByLikes(Pageable pageable);

    @Query("SELECT b FROM Board b " +
            "LEFT JOIN BoardComment l ON b.id = l.boardId " +
            "GROUP BY b.id " +
            "ORDER BY COUNT(l.id) DESC, b.createdAt DESC")
    Page<Board> findAllOrderedByComment(Pageable pageable);

    @Query("SELECT b FROM Board b " +
            "WHERE b.title LIKE %:search%")
    Page<Board> findByTitle(@Param("search") String search, Pageable pageable);

    @Query("SELECT b FROM Board b " +
            "WHERE b.content LIKE %:search%")
    Page<Board> findByContent(@Param("search") String search, Pageable pageable);

    @Query("SELECT b FROM Board b " +
            "LEFT JOIN Member m ON b.memberId = m.id " +
            "WHERE m.name LIKE %:search%")
    Page<Board> findByMemberName(@Param("search") String search, Pageable pageable);
}