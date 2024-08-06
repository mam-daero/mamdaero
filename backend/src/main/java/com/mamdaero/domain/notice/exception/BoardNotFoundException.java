package com.mamdaero.domain.notice.exception;

import com.mamdaero.global.exception.CustomException;

public class BoardNotFoundException extends CustomException {

    private static final long serialVersionUID = 1L;

    public BoardNotFoundException() {
        super(BoardExceptionConstants.BOARD_NOT_FOUND);
    }
}
