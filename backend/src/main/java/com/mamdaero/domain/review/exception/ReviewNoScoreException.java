package com.mamdaero.domain.review.exception;

import com.mamdaero.domain.global.exception.CustomException;

import java.io.Serial;

public class ReviewNoScoreException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ReviewNoScoreException() {
        super(ReviewExceptionConstants.REVIEW_NO_SCORE);
    }
}
