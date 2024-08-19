package com.mamdaero.domain.board.service;

import com.mamdaero.domain.board.dto.request.BoardRequest;
import com.mamdaero.domain.board.dto.response.BoardDetailResponse;
import com.mamdaero.domain.board.entity.Board;
import com.mamdaero.domain.board.repository.BoardLikeRepository;
import com.mamdaero.domain.board.repository.BoardRepository;
import com.mamdaero.domain.complaint.entity.Complaint;
import com.mamdaero.domain.complaint.entity.Source;
import com.mamdaero.domain.complaint.repository.ComplaintRepository;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.domain.notice.exception.BoardNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final ComplaintRepository complaintRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final FindUserService findUserService;

    @Transactional
    public BoardDetailResponse findDetail(Long id) {
        Long memberId = findUserService.findMemberId();
        log.info(String.valueOf(memberId));

        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        String writer = memberRepository.findById(board.getMemberId())
                .orElseThrow(CounselorNotFoundException::new)
                .getNickname();

        board.clickCounselorBoard();

        int likeCount = boardLikeRepository.countByBoardId(board.getId());
        boolean isLike = boardLikeRepository.existsByBoardIdAndMemberId(board.getId(), memberId);
        boolean isMine = boardRepository.existsByIdAndMemberId(board.getId(), memberId);

        return BoardDetailResponse.of(board, writer, likeCount, isLike, isMine);
    }

    @Transactional
    public void create(BoardRequest request) {
        Long memberId = findUserService.findMemberId();

        if(memberId == null) {
            throw new AccessDeniedException();
        }

        if(request.getTitle() == null || request.getContent() == null) {
            throw new BoardBadRequestException();
        }

        Board board = BoardRequest.toEntity(memberId, request);
        boardRepository.save(board);
    }

    @Transactional
    public BoardDetailResponse update(Long id, BoardRequest request) {
        Long memberId = findUserService.findMemberId();

        if(memberId == null) {
            throw new AccessDeniedException();
        }

        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        if(!Objects.equals(board.getMemberId(), memberId)) {
            throw new AccessDeniedException();
        }

        String writer = memberRepository.findById(board.getMemberId())
                .orElseThrow(CounselorNotFoundException::new)
                .getNickname();

        if (request.getTitle() != null) {
            board.updateTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            board.updateContent(request.getContent());
        }

        int likeCount = boardLikeRepository.countByBoardId(board.getId());
        boolean isLike = boardLikeRepository.existsByBoardIdAndMemberId(board.getId(), memberId);
        boolean isMine = boardRepository.existsByIdAndMemberId(board.getId(), memberId);

        return BoardDetailResponse.of(board, writer, likeCount, isLike, isMine);
    }

    @Transactional
    public void delete(Long id) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null) {
            throw new AccessDeniedException();
        }

        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        if(!memberRole.equals("관리자")) {
            if(!Objects.equals(board.getMemberId(), memberId)) {
                throw new AccessDeniedException();
            }
        }

        boardRepository.delete(board);
    }

    @Transactional
    public boolean complaint(Long id) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("관리자")) {
            throw new AccessDeniedException();
        }

        if(complaintRepository.existsByMemberIdAndEventSourceAndEventId(memberId, Source.BOARD, id)) {
            return false;
        }

        complaintRepository.save(Complaint.builder()
                .eventSource(Source.BOARD)
                .eventId(id)
                .memberId(memberId)
                .build());
        return true;
    }
}