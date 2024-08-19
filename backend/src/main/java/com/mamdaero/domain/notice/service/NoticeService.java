package com.mamdaero.domain.notice.service;

import com.mamdaero.domain.notice.dto.request.NoticeRequest;
import com.mamdaero.domain.notice.dto.response.NoticeDetailResponse;
import com.mamdaero.domain.notice.entity.Notice;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.domain.notice.exception.BoardNotFoundException;
import com.mamdaero.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Transactional
    public void create(Long memberId, NoticeRequest request) {

        if(request.getTitle() == null || request.getContent() == null) {
            throw new BoardBadRequestException();
        }

        noticeRepository.save(NoticeRequest.toEntity(memberId, request));
    }

    @Transactional
    public NoticeDetailResponse update(Long memberId, Long id, NoticeRequest request) {

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        if (request.getTitle() != null) {
            notice.updateTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            notice.updateContent(request.getContent());
        }

        noticeRepository.save(notice);
        return NoticeDetailResponse.of(notice);
    }

    @Transactional
    public void delete(Long memberId, Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        noticeRepository.delete(notice);
    }
}
