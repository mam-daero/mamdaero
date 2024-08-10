package com.mamdaero.domain.review.exception;

import com.mamdaero.global.exception.CustomException;

import java.io.Serial;

public class ReviewAlreadyExistException extends CustomException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ReviewAlreadyExistException() {
        super(ReviewExceptionConstants.REVIEW_ALREADY_EXIST);
    }
}
