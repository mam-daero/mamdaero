package com.mamdaero.domain.consult.repository;

import com.mamdaero.domain.consult.dto.response.ClientListResponse;
import com.mamdaero.domain.consult.entity.Consult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultRepository extends JpaRepository<Consult, Long> {

    @Query(
            "SELECT distinct new com.mamdaero.domain.consult.dto.response.ClientListResponse(" +
                    "m.id, m.name" +
                    ") " +
                    "FROM Reservation r " +
                    "JOIN Member m ON r.memberId = m.id " +
                    "JOIN CounselorItem ci ON r.counselorItemId = ci.counselorItemId " +
                    "WHERE (:name IS NULL OR m.name LIKE CONCAT('%', :name, '%'))" +
                    "AND ci.counselorId = :counselorId")
    Page<ClientListResponse> findMyClientList(@Param("counselorId") Long counselorId, @Param("name") String name, Pageable pageable);
}
