package com.mamdaero.domain.notice.controller;

import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.notice.dto.request.NoticeRequest;
import com.mamdaero.domain.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
@RequestMapping("/a/notice")
public class NoticeController {

    private final NoticeService noticeService;
    private final FindUserService findUserService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody NoticeRequest request) {
        if (Objects.equals(findUserService.findMemberRole(), "관리자")) {
            noticeService.create(findUserService.findMemberId(), request);
            return ResponseEntity.ok().build();
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PatchMapping("/{noticeId}")
    public ResponseEntity<?> update(@PathVariable("noticeId") Long id, @RequestBody NoticeRequest request) {

        if (Objects.equals(findUserService.findMemberRole(), "관리자")) {
            return ResponseEntity.ok(noticeService.update(findUserService.findMemberId(), id, request));
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<?> delete(@PathVariable("noticeId") Long id) {
        if (Objects.equals(findUserService.findMemberRole(), "관리자")) {
            noticeService.delete(findUserService.findMemberId(), id);
        return ResponseEntity.ok().build();
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
