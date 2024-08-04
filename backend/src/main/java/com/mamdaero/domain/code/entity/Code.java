package com.mamdaero.domain.code.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Code {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "code_group_id", nullable = false)
    private CodeGroup codeGroup;
    private String name;

}
