package com.mamdaero.domain.question.controller;

import com.mamdaero.domain.question.dto.request.QuestionRequest;
import com.mamdaero.domain.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/a/question")
    public ResponseEntity<?> create(@RequestBody QuestionRequest request) {
        questionService.create(request.getContent());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/p/question")
    public ResponseEntity<?> getQuestion() {
        return ResponseEntity.ok(questionService.getQuestion());
    }
}
