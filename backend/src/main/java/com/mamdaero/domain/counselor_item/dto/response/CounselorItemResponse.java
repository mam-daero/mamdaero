package com.mamdaero.domain.counselor_item.dto.response;

import com.mamdaero.domain.counselor_item.entity.CounselorItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CounselorItemResponse {

    private Long counselorItemId;
    private String name;
    private String description;
    private Integer fee;

    public static CounselorItemResponse of(CounselorItem counselorItem) {
        return CounselorItemResponse.builder()
                        .counselorItemId(counselorItem.getCounselorItemId())
                        .name(counselorItem.getName())
                        .description(counselorItem.getDescription())
                        .fee(counselorItem.getFee())
                        .build();
    }
}
