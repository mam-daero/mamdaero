package com.mamdaero.domain.counselor_board.service;

import com.mamdaero.domain.complaint.entity.Complaint;
import com.mamdaero.domain.complaint.entity.Source;
import com.mamdaero.domain.complaint.repository.ComplaintRepository;
import com.mamdaero.domain.counselor_board.dto.request.CounselorBoardCommentRequest;
import com.mamdaero.domain.counselor_board.dto.response.CounselorBoardCommentResponse;
import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardCommentRepository;
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
CounselorBoardCommentService {

    private final CounselorBoardCommentRepository boardCommentRepository;
    private final MemberRepository memberRepository;
    private final ComplaintRepository complaintRepository;
    private final FindUserService findUserService;

    public Pagination<CounselorBoardCommentResponse> findAll(int page, int size, Long id) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("내담자")) {
            throw new AccessDeniedException();
        }

        Pageable pageable = PageRequest.of(page, size);

        // 페이지네이션을 적용하여 댓글을 조회합니다.
        Page<CounselorBoardComment> boardPage = boardCommentRepository.findByBoardId(id, pageable);

        List<CounselorBoardCommentResponse> commentResponses = boardPage.getContent().stream()
                .map(comment -> {
                    String writer = memberRepository.findById(comment.getMemberId())
                            .orElseThrow(CounselorNotFoundException::new)
                            .getName();

                    boolean isMine = boardCommentRepository.existsByIdAndMemberId(comment.getId(), memberId);

                    return CounselorBoardCommentResponse.of(comment, writer, isMine);
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
    public void create(Long id, CounselorBoardCommentRequest request) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("내담자")) {
            throw new AccessDeniedException();
        }

        if(request.getComment() == null) {
            throw new BoardBadRequestException();
        }

        boardCommentRepository.save(CounselorBoardCommentRequest.toEntity(id, memberId, request));
    }

    @Transactional
    public CounselorBoardCommentResponse update(Long boardId, Long commentId, CounselorBoardCommentRequest request) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("내담자")) {
            throw new AccessDeniedException();
        }

        CounselorBoardComment comment = boardCommentRepository.findByIdAndBoardIdAndMemberId(commentId, boardId, memberId)
                .orElseThrow(CommentNotFoundException::new);

        comment.updateComment(request.getComment());

        String writer = memberRepository.findById(comment.getMemberId())
                .orElseThrow(CounselorNotFoundException::new)
                .getName();

        boolean isMine = boardCommentRepository.existsByIdAndMemberId(comment.getId(), memberId);

        return CounselorBoardCommentResponse.of(comment, writer, isMine);
    }

    @Transactional
    public void delete(Long boardId, Long commentId) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("내담자")) {
            throw new AccessDeniedException();
        }

        CounselorBoardComment comment = boardCommentRepository.findByIdAndBoardId(commentId, boardId)
                .orElseThrow(CommentNotFoundException::new);

        if(memberRole.equals("상담사")) {
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

        if(memberId == null || !memberRole.equals("상담사")) {
            throw new AccessDeniedException();
        }

        if(complaintRepository.existsByMemberIdAndEventSourceAndEventId(memberId, Source.COUNSELOR_BOARD_COMMENT, commentId)) {
            return false;
        }

        complaintRepository.save(Complaint.builder()
                .eventSource(Source.COUNSELOR_BOARD_COMMENT)
                .eventId(commentId)
                .memberId(memberId)
                .build());
        return true;
    }
}