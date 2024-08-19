package com.mamdaero.domain.postit.controller;

import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.postit.dto.request.PostitRequest;
import com.mamdaero.domain.postit.service.PostitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class PostitController {

    private final PostitService postitService;
    private final FindUserService findUserService;

    @GetMapping("/p/postit/{questionId}")
    public ResponseEntity<?> findPost(@RequestParam(name = "page", defaultValue = "0") int page,
                                      @RequestParam(name = "size", defaultValue = "10") int size,
                                      @PathVariable("questionId") Long questionId) {
        return ResponseEntity.ok(postitService.findPost(findUserService.findMemberId(), page, size, questionId));
    }

    @PostMapping("/cm/postit/{questionId}")
    public ResponseEntity<?> create(@PathVariable("questionId") Long questionId, @RequestBody PostitRequest request) {

        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {

            postitService.create(findUserService.findMemberId(), questionId, request);
            return ResponseEntity.ok().build();
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);

    }

    @PatchMapping("/cm/postit/{questionId}/{postitId}")
    public ResponseEntity<?> update(@PathVariable("questionId") Long questionId, @PathVariable("postitId") Long postitId, @RequestBody PostitRequest request) {
        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {
            return ResponseEntity.ok(postitService.update(findUserService.findMemberId(), questionId, postitId, request));
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @DeleteMapping("/cma/postit/{questionId}/{postitId}")
    public ResponseEntity<?> delete(@PathVariable("questionId") Long questionId, @PathVariable("postitId") Long postitId) {
        postitService.delete(findUserService.findMemberId(), questionId, postitId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cm/postit/{postitId}/complaint")
    public ResponseEntity<?> complaint(@PathVariable("postitId") Long id) {
        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {
            if (!postitService.complaint(findUserService.findMemberId(), id)) {
                return ResponseEntity.ok("이미 신고한 글입니다.");
            }
            return ResponseEntity.ok().build();
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}