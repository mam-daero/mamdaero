package com.mamdaero.domain.review.repository;

import com.mamdaero.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

//    List<Review> findAllByReservation_CounselorItem_CounselorId(Long id);
}
