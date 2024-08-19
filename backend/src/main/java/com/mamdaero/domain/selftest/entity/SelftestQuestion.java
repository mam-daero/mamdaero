package com.mamdaero.domain.selftest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
public class SelftestQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "selftest_question_id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "selftest_id")
    private Selftest selftest;
    private String selftestQuestionDetail;
    @OneToMany(mappedBy = "selftestQuestion")
    private List<SelftestQuestionOption> selftestQuestionOptionList;
}
