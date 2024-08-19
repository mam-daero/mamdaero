package com.mamdaero.domain.review.controller;

import com.mamdaero.domain.review.dto.request.CreateReviewRequest;
import com.mamdaero.domain.review.dto.request.UpdateReviewRequest;
import com.mamdaero.domain.review.dto.response.ReviewResponse;
import com.mamdaero.domain.review.service.ReviewService;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/p/counselor/{counselorId}/review")
    public ResponseEntity<Pagination<ReviewResponse>> findCounselorReview(
            @PathVariable(name = "counselorId") Long counselorId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {

        Pagination<ReviewResponse> reviewList = reviewService.findAllCounselorReview(counselorId, page, size);

        return new ResponseEntity<>(reviewList, HttpStatus.OK);
    }

    @GetMapping("/m/review")
    public ResponseEntity<Pagination<ReviewResponse>> findMyReview(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Pagination<ReviewResponse> reviewList = reviewService.findAllMyReview(page, size);
        return new ResponseEntity<>(reviewList, HttpStatus.OK);
    }

    @PostMapping("/m/review/{consultId}")
    public ResponseEntity<?> create(@PathVariable(name = "consultId") Long consultId, @RequestBody CreateReviewRequest request) {

        reviewService.create(consultId, request);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PatchMapping("/m/review/{reviewId}")
    public ResponseEntity<?> update(@PathVariable(name = "reviewId") Long reviewId, @RequestBody UpdateReviewRequest request) {

        reviewService.update(reviewId, request);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/m/review/{reviewId}")
    public ResponseEntity<?> delete(@PathVariable(name = "reviewId") Long reviewId) {

        reviewService.delete(reviewId);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}


