package com.mamdaero.domain.board.dto.response;

import com.mamdaero.domain.board.entity.BoardComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentResponse {

    private Long id;
    private String writer;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean isMine;

    public static BoardCommentResponse of(BoardComment comment, String writer, boolean isMine) {
        return BoardCommentResponse.builder()
                .id(comment.getId())
                .writer(writer)
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .isMine(isMine)
                .build();
    }
}
