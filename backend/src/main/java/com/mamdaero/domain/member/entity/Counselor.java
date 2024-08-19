package com.mamdaero.domain.member.entity;

import com.mamdaero.domain.member.dto.request.CounselorRequestDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
@AllArgsConstructor
@Table(name = "counselor")
@PrimaryKeyJoinColumn(name = "counselor_id")
public class Counselor extends Member{

    @Column(length = 128)
    private String address;
    @Column(nullable = false)
    private Integer level;
    @Column(nullable = false, unique = true, length = 10)
    private String license;
    @Column(length = 100)
    private String intro;
    @Column(length = 5000, name = "intro_detail")
    private String introDetail;
    @Column(length = 600)
    private String img;

    public void updateIntro(CounselorRequestDto requestDto){
        this.intro = requestDto.getIntro();
    }

    public void updateIntroDetail(CounselorRequestDto requestDto){
        this.introDetail = requestDto.getIntroDetail();
    }

    public void updateImg(String img){
        this.img = img;
    }
}
