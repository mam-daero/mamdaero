package com.mamdaero.domain.diary.dto.response;


import com.mamdaero.domain.diary.entity.Diary;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DiaryResponseDto {

    private Long id;
    private String emotion;
    private String content;
    private LocalDate date;
    private Boolean isOpen;

    public static DiaryResponseDto toDTO(Diary diary) {
        return DiaryResponseDto.builder()
                .id(diary.getId())
                .emotion(diary.getEmotion())
                .content(diary.getContent())
                .date(diary.getDate())
                .isOpen(diary.getIsOpen())
                .build();
    }
}
