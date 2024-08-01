package com.mamdaero.domain.selftest.entity;

import jakarta.persistence.*;
import lombok.*;

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
    @ManyToOne(fetch = FetchType.LAZY)
    private Selftest selftest;
    private String selftestQuestionDetail;
}
