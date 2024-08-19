package com.mamdaero.domain.board.controller;

import com.mamdaero.domain.board.dto.request.BoardCommentRequest;
import com.mamdaero.domain.board.service.BoardCommentService;
import com.mamdaero.domain.notification.service.NotifyBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;
    private final NotifyBoardService notifyBoardService;

    @GetMapping("/p/board/{boardId}/comment")
    public ResponseEntity<?> comment(@RequestParam(name = "page", defaultValue = "0") int page,
                                     @RequestParam(name = "size", defaultValue = "10") int size,
                                     @PathVariable("boardId") Long id) {
        return ResponseEntity.ok(boardCommentService.findAll(page, size, id));
    }

    @PostMapping("/cma/board/{boardId}/comment")
    public ResponseEntity<?> create(@PathVariable("boardId") Long id, @RequestBody BoardCommentRequest request) {
        boardCommentService.create(id, request);
        notifyBoardService.notifyCommentSave(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/cma/board/{boardId}/comment/{commentId}")
    public ResponseEntity<?> update(@PathVariable("boardId") Long boardId, @PathVariable("commentId") Long commentId, @RequestBody BoardCommentRequest request) {
        return ResponseEntity.ok(boardCommentService.update(boardId, commentId, request));
    }

    @DeleteMapping("/cma/board/{boardId}/comment/{commentId}")
    public ResponseEntity<?> delete(@PathVariable("boardId") Long boardId, @PathVariable("commentId") Long commentId) {
        boardCommentService.delete(boardId, commentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cm/board/{boardId}/comment/{commentId}/complaint")
    public ResponseEntity<?> complaint(@PathVariable("commentId") Long commentId) {
        if(!boardCommentService.complaint(commentId)){
            return ResponseEntity.ok("이미 신고한 댓글입니다.");
        }
        return ResponseEntity.ok().build();
    }
}
