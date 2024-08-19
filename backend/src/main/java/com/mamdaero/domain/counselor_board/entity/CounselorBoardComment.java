package com.mamdaero.domain.counselor_board.entity;

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
@SQLDelete(sql = "UPDATE counselor_board_comment SET is_delete = true WHERE counselor_board_comment_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "counselor_board_comment")
public class CounselorBoardComment extends BaseEntity {

    @Id
    @Column(name = "counselor_board_comment_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "counselor_board_id")
    private Long boardId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false, length = 300)
    private String comment;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public CounselorBoardComment(Long boardId, Long memberId, String comment) {
        this.boardId = boardId;
        this.memberId = memberId;
        this.comment = comment;
        this.isDelete = false;
    }

    public void updateComment(String comment) {
        this.comment = comment;
    }
}
