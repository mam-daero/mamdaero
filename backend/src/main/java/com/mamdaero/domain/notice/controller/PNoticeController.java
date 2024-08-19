package com.mamdaero.domain.notice.controller;

import com.mamdaero.domain.notice.service.PNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/p/notice")
public class PNoticeController {

    private final PNoticeService noticeService;

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(name = "page", defaultValue = "0") int page,
                                     @RequestParam(name = "size", defaultValue = "10") int size,
                                     @RequestParam(name = "searchField", defaultValue = "") String searchField,
                                     @RequestParam(name = "searchValue", defaultValue = "") String searchValue) {
        return ResponseEntity.ok(noticeService.findAll(page, size, searchField, searchValue));
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<?> findDetail(@PathVariable("noticeId") Long id) {
        return ResponseEntity.ok(noticeService.findDetail(id));
    }
}
