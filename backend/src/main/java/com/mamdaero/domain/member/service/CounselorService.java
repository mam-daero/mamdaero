package com.mamdaero.domain.member.service;

import com.mamdaero.domain.member.dto.request.CounselorRequestDto;
import com.mamdaero.domain.member.dto.response.CounselorResponseDto;
import com.mamdaero.domain.member.entity.Counselor;
import com.mamdaero.domain.member.exception.FileBadRequestException;
import com.mamdaero.domain.member.exception.FileNotFoundException;
import com.mamdaero.domain.member.exception.MemberNotFoundException;
import com.mamdaero.domain.member.repository.CounselorRepository;
import com.mamdaero.global.service.FileService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CounselorService {

    private final CounselorRepository counselorRepository;
    private final FileService fileService;

    @PersistenceContext
    private EntityManager entityManager;

    public Page<CounselorResponseDto> searchCounselorsByName(String name, String gender, Integer level, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return counselorRepository.searchCounselors(name, gender, level, pageable);
    }

    public Page<CounselorResponseDto> searchCounselorsByReviews(String name, String gender, Integer level, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return counselorRepository.searchCounselorsOrderByReviewCount(name, gender, level, pageable);
    }

    public Page<CounselorResponseDto> searchCounselorsByRating(String name, String gender, Integer level, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return counselorRepository.searchCounselorsOrderByReviewRating(name, gender, level, pageable);
    }

    public CounselorResponseDto find(final Long id) {
        Optional<Counselor> optionalCounselor = counselorRepository.findById(id);
        if (optionalCounselor.isPresent()) {
            Counselor counselor = optionalCounselor.get();

            return counselorRepository.findCounselorReviewSummaryById(counselor.getId());
        }

        throw new MemberNotFoundException();
    }

    @Transactional
    public void modifyIntro(final Long id, CounselorRequestDto requestDto) {
        Optional<Counselor> optionalCounselor = counselorRepository.findById(id);

        if (optionalCounselor.isPresent()) {
            Counselor counselor = optionalCounselor.get();
            counselor.updateIntro(requestDto);
        } else {
            throw new MemberNotFoundException();
        }
    }

    @Transactional
    public void modifyIntroDetail(final Long id, CounselorRequestDto requestDto) {
        Optional<Counselor> optionalCounselor = counselorRepository.findById(id);

        if (optionalCounselor.isPresent()) {
            Counselor counselor = optionalCounselor.get();
            counselor.updateIntroDetail(requestDto);
        } else {
            throw new MemberNotFoundException();
        }
    }

    @Transactional
    public void modifyImg(final Long memberId, MultipartFile file) throws IOException {

        if (file == null) {
            throw new FileBadRequestException();
        }

        if (file.isEmpty()) {
            throw new FileNotFoundException();
        }

        Optional<Counselor> optionalCounselor = counselorRepository.findById(memberId);

        if (optionalCounselor.isPresent()) {
            Counselor counselor = optionalCounselor.get();
            if (counselor.getImg() == null) {
                counselor.updateImg(fileService.saveProfile(file, memberId));
                return;
            }
            fileService.delete(counselor.getImg());
            counselor.updateImg(fileService.saveProfile(file, memberId));
        } else {
            throw new MemberNotFoundException();
        }
    }
}
