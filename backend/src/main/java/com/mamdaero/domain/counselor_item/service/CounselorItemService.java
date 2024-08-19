package com.mamdaero.domain.counselor_item.service;

import com.mamdaero.domain.counselor_item.dto.request.CounselorItemRequest;
import com.mamdaero.domain.counselor_item.dto.response.CounselorItemResponse;
import com.mamdaero.domain.counselor_item.entity.CounselorItem;
import com.mamdaero.domain.counselor_item.exception.CounselorItemBadRequestException;
import com.mamdaero.domain.counselor_item.exception.CounselorItemNotFoundException;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.counselor_item.repository.CounselorItemRepository;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CounselorItemService {

    private final CounselorItemRepository counselorItemRepository;
    private final FindUserService findUserService;

    public List<CounselorItemResponse> findCounselorItem(long counselorId) {
        return counselorItemRepository.findByCounselorId(counselorId)
                .stream()
                .map(CounselorItemResponse::of)
                .collect(Collectors.toList());
    }

    public List<CounselorItemResponse> findMyItem() {
        Long memberId = checkToken();

        return counselorItemRepository.findByCounselorId(memberId)
                .stream()
                .map(CounselorItemResponse::of)
                .collect(Collectors.toList());
    }

    @Transactional
    public void create(CounselorItemRequest request) {
        Long memberId = checkToken();

        if(request.getFee() > 1_000_000 || request.getFee() < 0 || request.getName() == null) {
            throw new CounselorItemBadRequestException();
        }

        counselorItemRepository.save(CounselorItemRequest.toEntity(memberId, request));
    }

    @Transactional
    public CounselorItemResponse update(long counselorItemId, CounselorItemRequest request) {
        CounselorItem item = counselorItemRepository.findById(counselorItemId)
                .orElseThrow(CounselorItemNotFoundException::new);

        Long memberId = checkToken();

        if(!Objects.equals(item.getCounselorId(), memberId)) {
            throw new CounselorNotFoundException();
        }

        if(request.getFee() > 2_000_000_000 || request.getFee() < 0) {
            throw new CounselorItemBadRequestException();
        }

        if(request.getName() == null) {
            throw new CounselorItemBadRequestException();
        }

        item.update(request);

        return CounselorItemResponse.of(item);
    }

    @Transactional
    public void delete(long counselorItemId) {
        CounselorItem item = counselorItemRepository.findById(counselorItemId)
                .orElseThrow(CounselorItemNotFoundException::new);

        Long memberId = checkToken();

        if(!Objects.equals(item.getCounselorId(), memberId)) {
            throw new CounselorNotFoundException();
        }

        counselorItemRepository.delete(item);
    }

    private Long checkToken() {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || !memberRole.equals("상담사")) {
            throw new AccessDeniedException();
        }

        return memberId;
    }
}