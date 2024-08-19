package com.mamdaero.domain.counselor_board.dto.request;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselorBoardCommentRequest {

    private String comment;

    public static CounselorBoardComment toEntity(Long boardId, Long memberId, CounselorBoardCommentRequest request) {
        return CounselorBoardComment.builder()
                .boardId(boardId)
                .memberId(memberId)
                .comment(request.getComment())
                .build();
    }
}
