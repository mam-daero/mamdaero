package com.mamdaero.domain.counselor_item.controller;

import com.mamdaero.domain.counselor_item.dto.request.CounselorItemRequest;
import com.mamdaero.domain.counselor_item.service.CounselorItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/c/counselor-item")
@RequiredArgsConstructor
public class CounselorItemController {

    private final CounselorItemService counselorItemService;

    @GetMapping
    public ResponseEntity<?> findMyItem() {
        return ResponseEntity.ok(counselorItemService.findMyItem());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CounselorItemRequest request) {
        counselorItemService.create(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{itemId}")
    public ResponseEntity<?> update(@PathVariable("itemId") Long id, @RequestBody CounselorItemRequest request) {
        return ResponseEntity.ok(counselorItemService.update(id, request));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> delete(@PathVariable("itemId") Long id) {
        counselorItemService.delete(id);
        return ResponseEntity.ok().build();
    }
}
