package com.mamdaero.domain.counselor_item.entity;

import com.mamdaero.domain.counselor_item.dto.request.CounselorItemRequest;
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
@SQLDelete(sql = "UPDATE counselor_item SET is_delete = true WHERE counselor_item_id = ?")
@Where(clause = "is_delete = false")
@Table(name = "counselor_item")
public class CounselorItem {

    @Id
    @Column(name = "counselor_item_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long counselorItemId;

    @Column(name = "counselor_id")
    private Long counselorId;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Integer fee;

    @Column(name = "is_delete")
    @ColumnDefault("false")
    private Boolean isDelete;

    @Builder
    public CounselorItem(Long counselorId, String name, String description, Integer fee) {
        this.counselorId = counselorId;
        this.name = name;
        this.description = description;
        this.fee = fee;
        this.isDelete = false;
    }

    public void update(CounselorItemRequest request) {
        this.name = request.getName();
        this.description = request.getDescription();
        this.fee = request.getFee();
    }
}