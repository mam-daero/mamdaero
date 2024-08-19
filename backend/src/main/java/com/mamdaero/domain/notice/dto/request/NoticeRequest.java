package com.mamdaero.domain.notice.dto.request;

import com.mamdaero.domain.notice.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequest {

    private String title;
    private String content;

    public static Notice toEntity(Long memberId, NoticeRequest request) {
        return Notice.builder()
                .memberId(memberId)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
    }
}
