package com.mamdaero.domain.review.dto.response;

import com.mamdaero.domain.review.entity.Review;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponseDto {

    private String review;
    private Float score;

    public static ReviewResponseDto toDto(Review review) {
        return ReviewResponseDto.builder()
                .review(review.getReview())
                .score(review.getScore())
                .build();
    }
}
