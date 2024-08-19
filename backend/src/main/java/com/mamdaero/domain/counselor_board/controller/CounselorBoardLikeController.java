package com.mamdaero.domain.counselor_board.controller;

import com.mamdaero.domain.counselor_board.service.CounselorBoardLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class CounselorBoardLikeController {

    private final CounselorBoardLikeService boardLikeService;

    @PostMapping("/c/counselor-board/{boardId}/like")
    public ResponseEntity<?> like(@PathVariable("boardId") Long id) {
        if(boardLikeService.like(id)) {
            return ResponseEntity.ok("좋아요 클릭");
        }
        return ResponseEntity.ok("좋아요 취소");
    }
}