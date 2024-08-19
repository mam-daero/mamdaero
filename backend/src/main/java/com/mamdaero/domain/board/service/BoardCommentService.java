package com.mamdaero.domain.board.service;

import com.mamdaero.domain.board.dto.request.BoardCommentRequest;
import com.mamdaero.domain.board.dto.response.BoardCommentResponse;
import com.mamdaero.domain.board.entity.BoardComment;
import com.mamdaero.domain.board.repository.BoardCommentRepository;
import com.mamdaero.domain.complaint.entity.Complaint;
import com.mamdaero.domain.complaint.entity.Source;
import com.mamdaero.domain.complaint.repository.ComplaintRepository;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.domain.notice.exception.CommentNotFoundException;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class
BoardCommentService {

    private final BoardCommentRepository boardCommentRepository;
    private final MemberRepository memberRepository;
    private final ComplaintRepository complaintRepository;
    private final FindUserService findUserService;

    public Pagination<BoardCommentResponse> findAll(int page, int size, Long id) {
        Long memberId = findUserService.findMemberId();

        Pageable pageable = PageRequest.of(page, size);

        Page<BoardComment> boardPage = boardCommentRepository.findByBoardId(id, pageable);

        List<BoardCommentResponse> commentResponses = boardPage.getContent().stream()
                .map(comment -> {
                    String writer = memberRepository.findById(comment.getMemberId())
                            .orElseThrow(CounselorNotFoundException::new)
                            .getNickname();

                    boolean isMine = boardCommentRepository.existsByIdAndMemberId(comment.getId(), memberId);

                    return BoardCommentResponse.of(comment, writer, isMine);
                })
                .collect(Collectors.toList());

        return new Pagination<>(
                commentResponses,
                boardPage.getNumber() + 1, // 현재 페이지 (0부터 시작하므로 +1)
                boardPage.getTotalPages(),
                boardPage.getSize(),
                (int) boardPage.getTotalElements()
        );
    }

    @Transactional
    public void create(Long id, BoardCommentRequest request) {
        Long memberId = checkTokenId();

        boardCommentRepository.save(BoardCommentRequest.toEntity(id, memberId, request));
    }

    @Transactional
    public BoardCommentResponse update(Long boardId, Long commentId, BoardCommentRequest request) {
        Long memberId = checkTokenId();

        BoardComment comment = boardCommentRepository.findByIdAndBoardIdAndMemberId(commentId, boardId, memberId)
                .orElseThrow(CommentNotFoundException::new);

        comment.updateComment(request.getComment());

        String writer = memberRepository.findById(comment.getMemberId())
                .orElseThrow(CounselorNotFoundException::new)
                .getNickname();

        boolean isMine = boardCommentRepository.existsByIdAndMemberId(comment.getId(), memberId);

        return BoardCommentResponse.of(comment, writer, isMine);
    }

    @Transactional
    public void delete(Long boardId, Long commentId) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null) {
            throw new AccessDeniedException();
        }

        BoardComment comment = boardCommentRepository.findByIdAndBoardId(commentId, boardId)
                .orElseThrow(CommentNotFoundException::new);

        if(!memberRole.equals("관리자")) {
            if(!Objects.equals(comment.getMemberId(), memberId)) {
                throw new AccessDeniedException();
            }
        }

        boardCommentRepository.delete(comment);
    }

    @Transactional
    public boolean complaint(Long commentId) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("관리자")) {
            throw new AccessDeniedException();
        }

        if(complaintRepository.existsByMemberIdAndEventSourceAndEventId(memberId, Source.BOARD, commentId)) {
            return false;
        }

        complaintRepository.save(Complaint.builder()
                .eventSource(Source.BOARD)
                .eventId(commentId)
                .memberId(memberId)
                .build());
        return true;
    }

    private Long checkTokenId() {
        Long memberId = findUserService.findMemberId();

        if(memberId == null) {
            throw new AccessDeniedException();
        }

        return memberId;
    }
}