package com.mamdaero.domain.selftest.entity;

import com.mamdaero.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
public class MemberSelftestList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_selftest_id")
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selftest_id")
    private Selftest selftest;
    @Builder.Default
    private Boolean isPublic = Boolean.TRUE;
    private Integer selftestTotalScore;
    @CreatedDate
    private LocalDateTime memberSelftestDate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_selftest_id")
    private List<SelftestQuestionResponse> selftestQuestionResponses;


    public void updateScore(Integer selftestTotalScore) {
        this.selftestTotalScore = selftestTotalScore;
    }
}
