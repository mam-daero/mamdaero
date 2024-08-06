package com.mamdaero.domain.review.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ReviewNoReviewException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ReviewNoReviewException() {
        super(ReviewExceptionConstants.REVIEW_NO_REVIEW);
    }
}
