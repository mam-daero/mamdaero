package com.mamdaero.domain.postit.service;

import com.mamdaero.domain.complaint.entity.Complaint;
import com.mamdaero.domain.complaint.entity.Source;
import com.mamdaero.domain.complaint.repository.ComplaintRepository;
import com.mamdaero.domain.counselor_item.exception.CounselorNotFoundException;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.notice.exception.BoardBadRequestException;
import com.mamdaero.domain.notice.exception.CommentNotFoundException;
import com.mamdaero.domain.postit.dto.request.PostitRequest;
import com.mamdaero.domain.postit.dto.response.PostitResponse;
import com.mamdaero.domain.postit.entity.Postit;
import com.mamdaero.domain.postit.repository.PostitLikeRepository;
import com.mamdaero.domain.postit.repository.PostitRepository;
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
public class PostitService {
    private final PostitRepository postitRepository;
    private final PostitLikeRepository postitLikeRepository;
    private final MemberRepository memberRepository;
    private final ComplaintRepository complaintRepository;
    public Pagination<PostitResponse> findPost(Long memberId, int page, int size, Long questionId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Postit> postitPage = postitRepository.findByQuestionIdOrderByCreatedAtDesc(questionId, pageable);
        List<PostitResponse> postitResponses = postitPage.getContent().stream()
                .map(postit -> {
                    int likeCount = postitLikeRepository.countByBoardId(postit.getId());
                    boolean isLike = postitLikeRepository.existsByBoardIdAndMemberId(postit.getId(), memberId);
                    boolean isMine = postitRepository.existsByIdAndMemberId(postit.getId(), memberId);
                    return PostitResponse.of(postit, likeCount, isLike, isMine);
                })
                .collect(Collectors.toList());
        return new Pagination<>(
                postitResponses,
                postitPage.getNumber() + 1,
                postitPage.getTotalPages(),
                postitPage.getSize(),
                (int) postitPage.getTotalElements()
        );
    }
    @Transactional
    public void create(Long memberId, Long questionId, PostitRequest request) {
        if(request.getContent() == null) {
            throw new BoardBadRequestException();
        }
        postitRepository.save(PostitRequest.toEntity(memberId, questionId, request));
    }

    @Transactional
    public PostitResponse update(Long memberId, Long questionId, Long postitId, PostitRequest request) {

        Postit post = postitRepository.findByQuestionIdAndIdAndMemberId(questionId, postitId, memberId)
                .orElseThrow(CommentNotFoundException::new);

        post.updateContent(request.getContent());

        int likeCount = postitLikeRepository.countByBoardId(post.getId());
        boolean isLike = postitLikeRepository.existsByBoardIdAndMemberId(post.getId(), memberId);
        boolean isMine = postitRepository.existsByIdAndMemberId(post.getId(), memberId);

        return PostitResponse.of(post, likeCount, isLike, isMine);
    }

    @Transactional
    public void delete(Long memberId, Long questionId, Long postitId) {

        Postit post = postitRepository.findByQuestionIdAndIdAndMemberId(questionId, postitId, memberId)
                .orElseThrow(CommentNotFoundException::new);

        postitRepository.delete(post);
    }

    @Transactional
    public boolean complaint(Long memberId, Long id) {

        if(complaintRepository.existsByMemberIdAndEventSourceAndEventId(memberId, Source.POSTIT, id)) {
            return false;
        }

        complaintRepository.save(Complaint.builder()
                .eventSource(Source.POSTIT)
                .eventId(id)
                .memberId(memberId)
                .build());
        return true;
    }
}