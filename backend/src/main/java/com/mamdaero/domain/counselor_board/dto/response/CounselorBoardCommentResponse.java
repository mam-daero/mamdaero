package com.mamdaero.domain.counselor_board.dto.response;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselorBoardCommentResponse {

    private Long id;
    private String writer;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean isMine;

    public static CounselorBoardCommentResponse of(CounselorBoardComment comment, String writer, boolean isMine) {
        return CounselorBoardCommentResponse.builder()
                .id(comment.getId())
                .writer(writer)
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .isMine(isMine)
                .build();
    }
}
