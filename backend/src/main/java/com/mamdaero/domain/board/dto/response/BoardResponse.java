package com.mamdaero.domain.board.dto.response;

import com.mamdaero.domain.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {

    private Long id;
    private String writer;
    private String title;
    private Integer view;
    private Integer likeCount;
    private LocalDateTime createdAt;

    public static BoardResponse of(Board board, String writer, int likeCount) {
        return BoardResponse.builder()
                .id(board.getId())
                .writer(writer)
                .title(board.getTitle())
                .view(board.getView())
                .likeCount(likeCount)
                .createdAt(board.getCreatedAt())
                .build();
    }
}