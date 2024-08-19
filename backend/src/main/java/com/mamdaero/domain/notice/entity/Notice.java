package com.mamdaero.domain.notice.entity;

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
@SQLDelete(sql = "UPDATE notice SET is_delete = true WHERE notice_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "notice")
public class Notice extends BaseEntity {

    @Id
    @Column(name = "notice_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noticeId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column
    @ColumnDefault("0")
    private Integer view;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public Notice(Long memberId, String title, String content) {
        this.memberId = memberId;
        this.title = title;
        this.content =content;
        this.view = 0;
        this.isDelete = false;
    }

    public void clickNotice() {
        this.view++;
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
