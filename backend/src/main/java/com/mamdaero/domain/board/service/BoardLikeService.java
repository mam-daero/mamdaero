package com.mamdaero.domain.board.service;

import com.mamdaero.domain.board.entity.BoardLike;
import com.mamdaero.domain.board.repository.BoardLikeRepository;
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
public class BoardLikeService {

    private final BoardLikeRepository boardLikeRepository;
    private final FindUserService findUserService;

    @Transactional
    public boolean like(Long boardId) {
        MemberInfoDTO member = findUserService.findMember();

        Long memberId = member.getMemberId();
        String memberRole = member.getMemberRole();

        if(memberId == null || memberRole.equals("관리자")) {
            throw new AccessDeniedException();
        }

        BoardLike like = boardLikeRepository.findByBoardIdAndMemberId(boardId, memberId);

        if (like == null) {
            BoardLike newLike = BoardLike.builder()
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