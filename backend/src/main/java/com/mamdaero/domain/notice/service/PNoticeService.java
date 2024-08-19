package com.mamdaero.domain.notice.service;

import com.mamdaero.domain.notice.dto.response.NoticeDetailResponse;
import com.mamdaero.domain.notice.dto.response.NoticeResponse;
import com.mamdaero.domain.notice.entity.Notice;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.domain.notice.exception.BoardNotFoundException;
import com.mamdaero.domain.notice.repository.NoticeRepository;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PNoticeService {

    private final NoticeRepository noticeRepository;

    public Pagination<NoticeResponse> findAll(int page, int size, String searchField, String searchValue) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Notice> boardPage;

        if (!searchField.isEmpty() && !searchValue.isEmpty()) {
            boardPage = findBoardsBySearch(searchField, searchValue, pageable);
        } else {
            boardPage = noticeRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<NoticeResponse> noticeResponses = convertToBoardResponses(boardPage.getContent());

        return new Pagination<>(
                noticeResponses,
                boardPage.getNumber() + 1,
                boardPage.getTotalPages(),
                boardPage.getSize(),
                (int) boardPage.getTotalElements()
        );
    }

    private Page<Notice> findBoardsBySearch(String searchField, String searchValue, Pageable pageable) {
        return switch (searchField) {
            case "title" -> noticeRepository.findByTitle(searchValue, pageable);
            default -> throw new BoardBadRequestException();
        };
    }

    private List<NoticeResponse> convertToBoardResponses(List<Notice> boards) {
        return boards.stream()
                .map(NoticeResponse::of)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoticeDetailResponse findDetail(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        notice.clickNotice();
        noticeRepository.save(notice);

        return NoticeDetailResponse.of(notice);
    }
}
