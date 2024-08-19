package com.mamdaero.domain.member.entity;

import com.mamdaero.domain.member.dto.request.MemberRequestDto;
import com.mamdaero.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
@Table(name = "member")
@Inheritance(strategy = InheritanceType.JOINED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "member_id")
    private Long id;
    @Column(length = 128, nullable = false)
    private String email;
    @Column(length = 128, nullable = false)
    private String password;
    @Column(length = 20, nullable = false)
    private String name;
    @Column(length = 20, nullable = false)
    private String nickname;
    private LocalDate birth;
    @Column(length = 128, nullable = false)
    private String tel;
    @Column(length = 1)
    private String gender;
    @Column(length = 3, nullable = false)
    private String role;
    @Column(nullable = false, name = "member_status")
    private Boolean memberStatus;
    @Column(length = 128)
    private String token;

    public void update(MemberRequestDto requestDto) {
        this.nickname = requestDto.getNickname();
        this.birth = requestDto.getBirth();
        this.tel = requestDto.getTel();
        this.gender = requestDto.getGender();
    }

    public void destroyRefreshToken()
    {
        this.token = null;
    }

    public void updateRefreshToken(String refreshToken)
    {
        this.token = refreshToken;
    }
}