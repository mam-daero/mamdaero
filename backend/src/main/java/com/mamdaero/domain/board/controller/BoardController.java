package com.mamdaero.domain.board.controller;

import com.mamdaero.domain.board.dto.request.BoardRequest;
import com.mamdaero.domain.board.service.BoardFindService;
import com.mamdaero.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final BoardFindService boardFindService;

    @GetMapping("/p/board")
    public ResponseEntity<?> findAll(@RequestParam(name = "page", defaultValue = "0") int page,
                                     @RequestParam(name = "size", defaultValue = "10") int size,
                                     @RequestParam(name = "condition", defaultValue = "new") String condition,
                                     @RequestParam(name = "searchField", defaultValue = "") String searchField,
                                     @RequestParam(name = "searchValue", defaultValue = "") String searchValue) {
        return ResponseEntity.ok(boardFindService.findAll(page, size, condition, searchField, searchValue));
    }

    @GetMapping("/p/board/{boardId}")
    public ResponseEntity<?> findDetail(@PathVariable("boardId") Long id) {
        return ResponseEntity.ok(boardService.findDetail(id));
    }

    @PostMapping("/cm/board")
    public ResponseEntity<?> create(@RequestBody BoardRequest request) {
        boardService.create(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/cm/board/{boardId}")
    public ResponseEntity<?> update(@PathVariable("boardId") Long id, @RequestBody BoardRequest request) {
        return ResponseEntity.ok(boardService.update(id, request));
    }

    @DeleteMapping("/cma/board/{boardId}")
    public ResponseEntity<?> delete(@PathVariable("boardId") Long id) {
        boardService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cm/board/{boardId}/complaint")
    public ResponseEntity<?> complaint(@PathVariable("boardId") Long id) {
        if(!boardService.complaint(id)){
            return ResponseEntity.ok("이미 신고한 글입니다.");
        }
        return ResponseEntity.ok().build();
    }
}