package com.mamdaero.domain.counselor_board.controller;

import com.mamdaero.domain.counselor_board.dto.request.CounselorBoardCommentRequest;
import com.mamdaero.domain.counselor_board.service.CounselorBoardCommentService;
import com.mamdaero.domain.notification.service.NotifyCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class CounselorBoardCommentController {

    private final CounselorBoardCommentService boardCommentService;
    private final NotifyCommentService notifyCommentService;

    @GetMapping("/ca/counselor-board/{boardId}/comment")
    public ResponseEntity<?> comment(@RequestParam(name = "page", defaultValue = "0") int page,
                                     @RequestParam(name = "size", defaultValue = "10") int size,
                                     @PathVariable("boardId") Long id) {
        return ResponseEntity.ok(boardCommentService.findAll(page, size, id));
    }

    @PostMapping("/ca/counselor-board/{boardId}/comment")
    public ResponseEntity<?> create(@PathVariable("boardId") Long id, @RequestBody CounselorBoardCommentRequest request) {
        boardCommentService.create(id, request);
        notifyCommentService.notifyCommentSave(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/ca/counselor-board/{boardId}/comment/{commentId}")
    public ResponseEntity<?> update(@PathVariable("boardId") Long boardId, @PathVariable("commentId") Long commentId, @RequestBody CounselorBoardCommentRequest request) {
        return ResponseEntity.ok(boardCommentService.update(boardId, commentId, request));
    }

    @DeleteMapping("/ca/counselor-board/{boardId}/comment/{commentId}")
    public ResponseEntity<?> delete(@PathVariable("boardId") Long boardId, @PathVariable("commentId") Long commentId) {
        boardCommentService.delete(boardId, commentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/c/counselor-board/comment/{commentId}/complaint")
    public ResponseEntity<?> complaint(@PathVariable("commentId") Long commentId) {
        if(!boardCommentService.complaint(commentId)){
            return ResponseEntity.ok("이미 신고한 글입니다.");
        }
        return ResponseEntity.ok().build();
    }
}