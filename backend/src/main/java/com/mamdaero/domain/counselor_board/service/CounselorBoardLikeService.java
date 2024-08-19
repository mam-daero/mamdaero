package com.mamdaero.domain.counselor_board.service;

import com.mamdaero.domain.counselor_board.entity.CounselorBoardLike;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardLikeRepository;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.service.FindUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounselorBoardLikeService {

    private final CounselorBoardLikeRepository boardLikeRepository;
    private final FindUserService findUserService;

    @Transactional
    public boolean like(Long boardId) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || !memberRole.equals("상담사")) {
            throw new AccessDeniedException();
        }

        CounselorBoardLike like = boardLikeRepository.findByBoardIdAndMemberId(boardId, memberId);

        if (like == null) {
            CounselorBoardLike newLike = CounselorBoardLike.builder()
                    .boardId(boardId)
                    .memberId(memberId)
                    .build();
            boardLikeRepository.save(newLike);
            return true;
        }

        boardLikeRepository.delete(like);
        return false;
    }
}