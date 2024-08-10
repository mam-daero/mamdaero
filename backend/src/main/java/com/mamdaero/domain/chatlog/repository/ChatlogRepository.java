package com.mamdaero.domain.chatlog.repository;

import com.mamdaero.domain.chatlog.entity.Chatlog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatlogRepository extends JpaRepository<Chatlog, Long> {

    Page<Chatlog> findByReservationId(Long reservationId, Pageable pageable);
}
