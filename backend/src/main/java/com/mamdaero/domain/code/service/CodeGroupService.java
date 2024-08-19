package com.mamdaero.domain.code.service;

import com.mamdaero.domain.code.dto.response.CodeGroupResponse;
import com.mamdaero.domain.code.entity.CodeGroup;
import com.mamdaero.domain.code.repository.CodeGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CodeGroupService {
    private final CodeGroupRepository codeGroupRepository;


    public List<CodeGroupResponse> findAll() {
        List<CodeGroup> codeGroups = codeGroupRepository.findAll();
        List<CodeGroupResponse> result = new ArrayList<>();
        for (CodeGroup codeGroup : codeGroups) {
            result.add(CodeGroupResponse.builder()
                    .id(codeGroup.getId())
                    .name(codeGroup.getName())
                    .build());
        }
        return result;
    }


}
