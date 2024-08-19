package com.mamdaero.domain.counselor_board.service;

import com.mamdaero.domain.counselor_board.dto.response.CounselorBoardResponse;
import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardLikeRepository;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardRepository;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.member.exception.AccessDeniedException;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.global.dto.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CounselorBoardFindService {

    private final CounselorBoardRepository boardRepository;
    private final CounselorBoardLikeRepository boardLikeRepository;
    private final MemberRepository memberRepository;
    private final FindUserService findUserService;

    public Pagination<CounselorBoardResponse> findAll(int page, int size, String condition, String searchField, String searchValue) {
        String memberRole = findUserService.findMemberRole();

        if(memberRole.equals("내담자")) {
            throw new AccessDeniedException();
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<CounselorBoard> boardPage;
        if (!searchField.isEmpty() && !searchValue.isEmpty()) {
            boardPage = findBoardsBySearch(searchField, searchValue, pageable);
        } else {
            boardPage = findBoardsByCondition(condition, pageable);
        }

        List<CounselorBoardResponse> boardResponses = convertToBoardResponses(boardPage.getContent());

        return new Pagination<>(
                boardResponses,
                boardPage.getNumber() + 1,
                boardPage.getTotalPages(),
                boardPage.getSize(),
                (int) boardPage.getTotalElements()
        );
    }

    private Page<CounselorBoard> findBoardsBySearch(String searchField, String searchValue, Pageable pageable) {
        return switch (searchField) {
            case "title" -> boardRepository.findByTitle(searchValue, pageable);
            case "content" -> boardRepository.findByContent(searchValue, pageable);
            case "name" -> boardRepository.findByMemberName(searchValue, pageable);
            default -> throw new BoardBadRequestException();
        };
    }

    private Page<CounselorBoard> findBoardsByCondition(String condition, Pageable pageable) {
        return switch (condition) {
            case "new" -> boardRepository.findAllByOrderByCreatedAtDesc(pageable);
            case "old" -> boardRepository.findAllByOrderByCreatedAt(pageable);
            case "best" -> boardRepository.findAllOrderedByLikes(pageable);
            case "comment" -> boardRepository.findAllOrderedByComment(pageable);
            default -> throw new BoardBadRequestException();
        };
    }

    private List<CounselorBoardResponse> convertToBoardResponses(List<CounselorBoard> boards) {
        return boards.stream()
                .map(board -> {
                    String writer = memberRepository.findById(board.getMemberId())
                            .orElseThrow(CounselorNotFoundException::new)
                            .getName();

                    int likeCount = boardLikeRepository.countByBoardId(board.getId());

                    return CounselorBoardResponse.of(board, writer, likeCount);
                })
                .collect(Collectors.toList());
    }
}
