package com.mamdaero.domain.board.service;

import com.mamdaero.domain.board.dto.response.BoardResponse;
import com.mamdaero.domain.board.entity.Board;
import com.mamdaero.domain.board.repository.BoardLikeRepository;
import com.mamdaero.domain.board.repository.BoardRepository;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.member.repository.MemberRepository;
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
public class BoardFindService {

    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final MemberRepository memberRepository;

    public Pagination<BoardResponse> findAll(int page, int size, String condition, String searchField, String searchValue) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Board> boardPage;
        if (!searchField.isEmpty() && !searchValue.isEmpty()) {
            boardPage = findBoardsBySearch(searchField, searchValue, pageable);
        } else {
            boardPage = findBoardsByCondition(condition, pageable);
        }

        List<BoardResponse> boardResponses = convertToBoardResponses(boardPage.getContent());

        return new Pagination<>(
                boardResponses,
                boardPage.getNumber() + 1,
                boardPage.getTotalPages(),
                boardPage.getSize(),
                (int) boardPage.getTotalElements()
        );
    }

    private Page<Board> findBoardsBySearch(String searchField, String searchValue, Pageable pageable) {
        return switch (searchField) {
            case "title" -> boardRepository.findByTitle(searchValue, pageable);
            case "content" -> boardRepository.findByContent(searchValue, pageable);
            case "name" -> boardRepository.findByMemberName(searchValue, pageable);
            default -> throw new BoardBadRequestException();
        };
    }

    private Page<Board> findBoardsByCondition(String condition, Pageable pageable) {
        return switch (condition) {
            case "new" -> boardRepository.findAllByOrderByCreatedAtDesc(pageable);
            case "old" -> boardRepository.findAllByOrderByCreatedAt(pageable);
            case "best" -> boardRepository.findAllOrderedByLikes(pageable);
            case "comment" -> boardRepository.findAllOrderedByComment(pageable);
            default -> throw new BoardBadRequestException();
        };
    }

    private List<BoardResponse> convertToBoardResponses(List<Board> boards) {
        return boards.stream()
                .map(board -> {
                    String writer = memberRepository.findById(board.getMemberId())
                            .orElseThrow(CounselorNotFoundException::new)
                            .getNickname();

                    int likeCount = boardLikeRepository.countByBoardId(board.getId());

                    return BoardResponse.of(board, writer, likeCount);
                })
                .collect(Collectors.toList());
    }
}
