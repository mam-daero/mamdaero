package com.mamdaero.domain.question.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE question SET is_delete = true WHERE question_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "question")
public class Question {

    @Id
    @Column(name = "question_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public Question(String content) {
        this.content = content;
        this.isDelete = false;;
    }

    public void setIsDelete() {
        this.isDelete = true;
    }
}
