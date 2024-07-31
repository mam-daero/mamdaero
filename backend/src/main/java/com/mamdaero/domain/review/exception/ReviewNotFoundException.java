package com.mamdaero.domain.review.exception;

import com.mamdaero.domain.global.exception.CustomException;

import java.io.Serial;

public class ReviewNotFoundException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ReviewNotFoundException() {
        super(ReviewExceptionConstants.REVIEW_NOT_FOUND);
    }
}
