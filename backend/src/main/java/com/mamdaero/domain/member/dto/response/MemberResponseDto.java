package com.mamdaero.domain.member.dto.response;

import com.mamdaero.domain.member.entity.Member;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;


@Data
@Builder
public class MemberResponseDto {

    private Long id;
    private String email;
    private String name;
    private String nickname;
    private LocalDate birth;
    private String tel;
    private String gender;

    public static MemberResponseDto toDTO(Member member) {
        return MemberResponseDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .birth(member.getBirth())
                .tel(member.getTel())
                .gender(member.getGender())
                .build();
    }
}
