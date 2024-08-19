package com.mamdaero.domain.postit.dto.request;

import com.mamdaero.domain.postit.entity.Postit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostitRequest {

    private String content;

    public static Postit toEntity(Long memberId, Long questionId, PostitRequest request) {
        return Postit.builder()
                .memberId(memberId)
                .questionId(questionId)
                .content(request.getContent())
                .build();
    }
}