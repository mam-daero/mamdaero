package com.mamdaero.domain.chatlog.repository;

import com.mamdaero.domain.chatlog.entity.Chatlog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatlogRepository extends JpaRepository<Chatlog, Long> {

    List<Chatlog> findByReservationId(Long reservationId);
}
