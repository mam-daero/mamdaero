package com.mamdaero.domain.postit.controller;

import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.postit.service.PostitLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class PostitLikeController {

    private final PostitLikeService postitLikeService;
    private final FindUserService findUserService;

    @PostMapping("/cm/postit/{postitId}/like")
    public ResponseEntity<?> like(@PathVariable("postitId") Long id) {
        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {
            if (postitLikeService.like(findUserService.findMemberId(), id)) {
                return ResponseEntity.ok("좋아요 클릭");
            }
            return ResponseEntity.ok("좋아요 취소");
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
