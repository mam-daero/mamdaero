package com.mamdaero.domain.notice.dto.response;

import com.mamdaero.domain.notice.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDetailResponse {

    private Long noticeId;
    private String title;
    private String content;
    private Integer view;
    private LocalDateTime createdAt;

    public static NoticeDetailResponse of(Notice notice) {
        return NoticeDetailResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .view(notice.getView())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
