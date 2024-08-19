package com.mamdaero.domain.postit.entity;

import com.mamdaero.global.entity.BaseEntity;
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
@SQLDelete(sql = "UPDATE post SET is_delete = true WHERE post_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "post")
public class Postit extends BaseEntity {

    @Id
    @Column(name = "post_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false, length = 200)
    private String content;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public Postit(Long memberId, Long questionId, String content) {
        this.memberId = memberId;
        this.questionId = questionId;
        this.content =content;
        this.isDelete = false;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}