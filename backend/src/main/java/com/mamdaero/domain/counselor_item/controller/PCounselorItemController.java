package com.mamdaero.domain.counselor_item.controller;

import com.mamdaero.domain.counselor_item.service.CounselorItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/p/counselor-item")
@RequiredArgsConstructor
public class PCounselorItemController {

    private final CounselorItemService counselorItemService;

    @GetMapping("/{counselorId}")
    public ResponseEntity<?> findCounselorItem(@PathVariable("counselorId") Long counselorId) {
        return ResponseEntity.ok(counselorItemService.findCounselorItem(counselorId));
    }
}