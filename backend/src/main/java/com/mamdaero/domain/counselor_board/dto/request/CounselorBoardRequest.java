package com.mamdaero.domain.counselor_board.dto.request;

import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselorBoardRequest {

    private String title;
    private String content;

    public static CounselorBoard toEntity(Long memberId, CounselorBoardRequest request) {
        return CounselorBoard.builder()
                .memberId(memberId)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
    }
}