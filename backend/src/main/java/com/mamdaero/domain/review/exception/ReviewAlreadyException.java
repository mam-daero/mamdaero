package com.mamdaero.domain.review.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class ReviewAlreadyException extends CustomException {

    private static final long serialVersionUID = 1L;

    public ReviewAlreadyException() {
        super(ReviewExceptionConstants.REVIEW_ALREADY);
    }
}
