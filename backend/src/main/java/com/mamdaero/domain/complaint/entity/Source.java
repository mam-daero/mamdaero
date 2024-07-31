package com.mamdaero.domain.complaint.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Source {
    COUNSELOR_BOARD("상담사 게시판"),
    COUNSELOR_BOARD_COMMENT("상담사 게시판 댓글"),
    BOARD("자유게시판"),
    BOARD_COMMENT("자유게시판 댓글"),
    POSTIT("익명 포스트");

    private final String source;
}