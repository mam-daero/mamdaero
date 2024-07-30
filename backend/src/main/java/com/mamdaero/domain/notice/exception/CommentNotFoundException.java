package com.mamdaero.domain.notice.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class CommentNotFoundException extends CustomException  {

    private static final long serialVersionUID = 1L;

    public CommentNotFoundException() {
        super(BoardExceptionConstants.COMMENT_NOT_FOUND);
    }
}
