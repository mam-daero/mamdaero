package com.mamdaero.domain.consult_report.entity;

import com.mamdaero.domain.consult_report.dto.request.UpdateConsultReportRequest;
import com.mamdaero.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class ConsultReport extends BaseEntity {

    @Id
    @Column(name = "consult_report_id")
    private Long id;
    @Column(length = 200, nullable = false)
    private String title;
    @Column(length = 5000, nullable = false)
    private String detail;
    @Column(length = 3000)
    private String opinion;

    public void update(UpdateConsultReportRequest request) {
        this.title = request.getTitle();
        this.detail = request.getDetail();
        this.opinion = request.getOpinion();
    }
}
