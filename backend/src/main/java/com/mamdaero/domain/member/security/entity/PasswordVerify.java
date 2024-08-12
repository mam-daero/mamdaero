package com.mamdaero.domain.member.security.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "passwordVerify")
public class PasswordVerify
{
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codeId;
    @Column (length = 40)
    private String email;
    @Column (length = 40)
    private String verifyToken;
}
