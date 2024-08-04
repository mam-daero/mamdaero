package com.mamdaero.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class Pagination<T> {
    private List<T> data;
    private Integer currentPage;
    private Integer totalPages;
    private Integer pageSize;
    private Integer totalItems;
}
