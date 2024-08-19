package com.mamdaero.domain.code.service;

import com.mamdaero.domain.code.dto.response.CodeResponse;
import com.mamdaero.domain.code.repository.CodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CodeService {
    private final CodeRepository codeRepository;


    public List<CodeResponse> findCodesByCodeGroupName(String name) {
        return codeRepository.findCodesByCodeGroupName(name);
    }
}
