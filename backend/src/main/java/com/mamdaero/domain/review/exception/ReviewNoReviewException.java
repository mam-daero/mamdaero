package com.mamdaero.domain.review.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ReviewNoReviewException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ReviewNoReviewException() {
        super(ReviewExceptionConstants.REVIEW_NO_REVIEW);
    }
}
