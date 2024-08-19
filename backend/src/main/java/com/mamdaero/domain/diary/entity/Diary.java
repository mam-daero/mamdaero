package com.mamdaero.domain.diary.entity;

import com.mamdaero.domain.diary.dto.request.DiaryRequestDto;
import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
public class Diary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    private String emotion;
    private String content;
    private LocalDate date;
    @Builder.Default
    private Boolean isOpen = false;
    @Builder.Default
    private Boolean isDelete = false;

    public void update(DiaryRequestDto requestDto) {
        this.emotion = requestDto.getEmotion();
        this.content = requestDto.getContent();
        this.date = requestDto.getDate();
        this.isOpen = requestDto.getIsOpen();
    }
}
