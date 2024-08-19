package com.mamdaero.domain.counselor_board.entity;

import com.mamdaero.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE counselor_board SET is_delete = true WHERE counselor_board_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "counselor_board")
@ToString
public class CounselorBoard extends BaseEntity {

    @Id
    @Column(name = "counselor_board_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column
    @ColumnDefault("0")
    private Integer view;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public CounselorBoard(Long memberId, String title, String content) {
        this.memberId = memberId;
        this.title = title;
        this.content =content;
        this.view = 0;
        this.isDelete = false;
    }

    public void clickCounselorBoard() {
        this.view++;
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}