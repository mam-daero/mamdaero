package com.mamdaero.domain.diary.dto;


import com.mamdaero.domain.diary.entity.Diary;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DiaryResponseDto {
    private String content;
    private LocalDate date;

    public static DiaryResponseDto toDTO(Diary diary) {
        return DiaryResponseDto.builder()
                .content(diary.getContent())
                .date(diary.getDate())
                .build();
    }
}
