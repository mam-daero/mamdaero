package com.mamdaero.domain.notice.exception;

import com.mamdaero.domain.global.exception.CustomException;

public class BoardBadRequestException extends CustomException {

    private static final long serialVersionUID = 1L;

    public BoardBadRequestException() {
        super(BoardExceptionConstants.BOARD_BAD_REQUEST);
    }
}
