package com.mamdaero.domain.consulting.controller;

import com.mamdaero.domain.consulting.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ScriptController {

    private final ScriptService scriptService;

    @GetMapping("/c/script/{consultId}")
    public ResponseEntity<String> getScript() {
        String script = scriptService.speechToText();
        return ResponseEntity.ok(script);
    }

    @GetMapping("/c/summarized-script/{consultId}")
    public ResponseEntity<String> getSummarizedScript() {

        String script = scriptService.summaryFromGPT();

        return ResponseEntity.ok(script);
    }
}
