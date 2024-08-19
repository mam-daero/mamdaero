package com.mamdaero.domain.counselor_board.dto.response;

import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselorBoardResponse {

    private Long id;
    private String writer;
    private String title;
    private Integer view;
    private Integer likeCount;
    private LocalDateTime createdAt;

    public static CounselorBoardResponse of(CounselorBoard board, String writer, int likeCount) {
        return CounselorBoardResponse.builder()
                .id(board.getId())
                .writer(writer)
                .title(board.getTitle())
                .view(board.getView())
                .likeCount(likeCount)
                .createdAt(board.getCreatedAt())
                .build();
    }
}