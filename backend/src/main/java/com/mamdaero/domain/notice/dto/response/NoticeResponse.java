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
public class NoticeResponse {

    private Long noticeId;
    private String title;
    private Integer view;
    private LocalDateTime createdAt;

    public static NoticeResponse of(Notice notice) {
        return NoticeResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .view(notice.getView())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
