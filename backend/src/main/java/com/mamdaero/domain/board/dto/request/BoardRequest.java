package com.mamdaero.domain.board.dto.request;

import com.mamdaero.domain.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {

    private String title;
    private String content;

    public static Board toEntity(Long memberId, BoardRequest request) {
        return Board.builder()
                .memberId(memberId)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
    }
}