package com.mamdaero.domain.board.dto.request;

import com.mamdaero.domain.board.entity.BoardComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentRequest {

    private String comment;

    public static BoardComment toEntity(Long boardId, Long memberId, BoardCommentRequest request) {
        return BoardComment.builder()
                .boardId(boardId)
                .memberId(memberId)
                .comment(request.getComment())
                .build();
    }
}
