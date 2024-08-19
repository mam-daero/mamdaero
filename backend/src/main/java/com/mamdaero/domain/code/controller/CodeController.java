package com.mamdaero.domain.code.controller;

import com.mamdaero.domain.code.dto.response.CodeGroupResponse;
import com.mamdaero.domain.code.dto.response.CodeResponse;
import com.mamdaero.domain.code.service.CodeGroupService;
import com.mamdaero.domain.code.service.CodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;
    private final CodeGroupService codeGroupService;

    @GetMapping("/a/code-group")
    public ResponseEntity<List<CodeGroupResponse>> getCodeGroups() {
        return new ResponseEntity<>(codeGroupService.findAll(), HttpStatus.OK);
    }

    // 지금은 필요 없어보이는 API라서 구현 안함
    @GetMapping("/a/code-group/{groupId}")
    public ResponseEntity<List<CodeResponse>> getCodeGroup(@PathVariable(name = "groupId") Long groupId) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/p/symptom")
    public ResponseEntity<List<CodeResponse>> getSymptoms() {
        return new ResponseEntity<>(codeService.findCodesByCodeGroupName("symptom"), HttpStatus.OK);
    }

    @GetMapping("/p/situation")
    public ResponseEntity<List<CodeResponse>> getSituations() {
        return new ResponseEntity<>(codeService.findCodesByCodeGroupName("situation"), HttpStatus.OK);
    }
}
