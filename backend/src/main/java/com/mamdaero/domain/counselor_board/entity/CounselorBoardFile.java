package com.mamdaero.domain.counselor_board.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE counselor_board_file SET is_delete = true WHERE file_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "counselor_board_file")
public class CounselorBoardFile {

    @Id
    @Column(name = "file_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "counselor_board_id")
    private Long boardId;

    @Column
    private String url;

    @Column(name = "is_delete", nullable = false)
    @ColumnDefault("false")
    private Boolean isDelete;
}
