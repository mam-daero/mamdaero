package com.mamdaero.domain.review.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private String review;
    private Float score;


}
