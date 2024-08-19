package com.mamdaero.domain.consult.controller;

import com.mamdaero.domain.consult.dto.response.ClientListResponse;
import com.mamdaero.domain.consult.service.ConsultService;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ConsultController {

    private final ConsultService consultService;

    @GetMapping("/c/client")
    public ResponseEntity<Pagination<ClientListResponse>> findMyClientList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "name", required = false) String search
    ) {
        return ResponseEntity.ok(consultService.findMyClientList(page, size, search));
    }

    public ResponseEntity<?> enterRoom() {

        return null;
    }
}
