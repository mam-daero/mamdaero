package com.mamdaero.domain.code.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class CodeGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_group_id")
    private Long id;
    private String name;
}
