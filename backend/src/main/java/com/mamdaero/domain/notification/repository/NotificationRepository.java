package com.mamdaero.domain.notification.repository;

import com.mamdaero.domain.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByMemberIdOOrderByCreatedAtDesc(Long memberId, Pageable pageable);
}
