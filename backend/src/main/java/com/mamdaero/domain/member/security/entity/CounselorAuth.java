package com.mamdaero.domain.member.security.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@Table(name = "counselorAuth")
public class CounselorAuth
{
    @Id
    @Column
    private Long authId;
    @Column (length = 20, nullable = false)
    private String name;
    @Column (length = 60, nullable = false)
    private String roleNumber;
    @Column (length = 128, nullable = false)
    private String email;
    @Column (length = 40)
    private String authToken;
}
