package com.mamdaero.domain.review.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ReviewBadRequestException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ReviewBadRequestException() {
        super(ReviewExceptionConstants.REVIEW_BAD_REQUEST);
    }
}
