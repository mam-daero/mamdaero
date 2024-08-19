package com.mamdaero.domain.reservation.repository;

import com.mamdaero.domain.reservation.dto.response.ReservationListResponse;
import com.mamdaero.domain.reservation.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT new com.mamdaero.domain.reservation.dto.response.ReservationListResponse(r.id, wt.date, wt.time, r.status, r.itemName, r.itemFee, r.canceler, r.canceledAt, r.requirement, r.isDiaryShared, r.isTestShared, m.name, c.name, false) " +
            "FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
            "JOIN Member m ON r.memberId = m.id " +
            "JOIN Counselor c ON ci.counselorId = c.id " +
            "WHERE r.memberId = :memberId " +
            "AND r.status != '상담완료' " +
            "ORDER BY wt.date DESC, wt.time DESC, r.createdAt DESC")
    Page<ReservationListResponse> findByMemberId(@Param("memberId") Long memberId, Pageable pageable);

    @Query("SELECT new com.mamdaero.domain.reservation.dto.response.ReservationListResponse(r.id, wt.date, wt.time, r.status, r.itemName, r.itemFee, r.canceler, r.canceledAt, r.requirement, r.isDiaryShared, r.isTestShared,  m.name, c.name, false) " +
            "FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
            "JOIN Member m ON r.memberId = m.id " +
            "JOIN Counselor c ON ci.counselorId = c.id " +
            "WHERE ci.counselorId = :counselorId " +
            "AND r.status != '상담완료' " +
            "ORDER BY wt.date DESC, wt.time DESC, r.createdAt DESC")
    Page<ReservationListResponse> findByCounselorId(@Param("counselorId") Long counselorId, Pageable pageable);

    @Query("SELECT new com.mamdaero.domain.reservation.dto.response.ReservationListResponse(r.id, wt.date, wt.time, r.status, r.itemName, r.itemFee, r.canceler, r.canceledAt, r.requirement, r.isDiaryShared, r.isTestShared,  m.name, c.name, " +
            "CASE WHEN rv IS NULL OR rv.isDelete = true THEN false ELSE true END) " +
            "FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
            "JOIN Member m ON r.memberId = m.id " +
            "JOIN Counselor c ON ci.counselorId = c.id " +
            "LEFT JOIN Review rv ON r.id = rv.id " +
            "WHERE r.memberId = :memberId " +
            "AND r.status = '상담완료' " +
            "AND r.isDelete = false " +
            "ORDER BY wt.date DESC, wt.time DESC, r.createdAt DESC")
    Page<ReservationListResponse> findByMemberIdComplete(@Param("memberId") Long memberId, Pageable pageable);

    @Query("SELECT new com.mamdaero.domain.reservation.dto.response.ReservationListResponse(r.id, wt.date, wt.time, r.status, r.itemName, r.itemFee, r.canceler, r.canceledAt, r.requirement, r.isDiaryShared, r.isTestShared,  m.name, c.name, " +
            "CASE WHEN rv IS NULL OR rv.isDelete = true THEN false ELSE true END) " +
            "FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
            "JOIN Member m ON r.memberId = m.id " +
            "JOIN Counselor c ON ci.counselorId = c.id " +
            "LEFT JOIN Review rv ON r.id = rv.id " +
            "WHERE ci.counselorId = :counselorId " +
            "AND r.status = '상담완료' " +
            "ORDER BY wt.date DESC, wt.time DESC, r.createdAt DESC")
    Page<ReservationListResponse> findByCounselorIdComplete(@Param("counselorId") Long counselorId, Pageable pageable);

    @Query("SELECT r FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "LEFT JOIN r.situations " +
            "LEFT JOIN r.symptoms WHERE r.id = :id")
    Reservation findReservationWithDetails(@Param("id") Long id);

    Reservation findByCounselorItemIdAndId(Long counselorItemId, Long reservationId);

    Reservation findByMemberIdAndId(Long memberId, Long reservationId);

    @Query("SELECT r " +
            "FROM Reservation r " +
            "JOIN WorkTime wt ON r.workTimeId = wt.id " +
            "WHERE wt.date = :date AND wt.time = :time " +
            "AND r.status = '예약완료' " +
            "ORDER BY r.createdAt DESC")
    List<Reservation> findReservationsBefore(@Param("date") LocalDate date, @Param("time") int time);
}

