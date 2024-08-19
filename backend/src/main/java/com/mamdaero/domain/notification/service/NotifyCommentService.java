package com.mamdaero.domain.notification.service;

import com.mamdaero.domain.counselor_board.entity.CounselorBoard;
import com.mamdaero.domain.counselor_board.entity.CounselorBoardComment;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardCommentRepository;
import com.mamdaero.domain.counselor_board.repository.CounselorBoardRepository;
import com.mamdaero.domain.notification.controller.NotificationController;
import com.mamdaero.domain.notification.entity.EventSource;
import com.mamdaero.domain.notification.entity.Notification;
import com.mamdaero.domain.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotifyCommentService {

    private final NotificationRepository notificationRepository;
    private final CounselorBoardRepository counselorBoardRepository;
    private final CounselorBoardCommentRepository counselorBoardCommentRepository;

    public void notifyCommentSave(Long boardID) {
        CounselorBoard counselorBoard = counselorBoardRepository.findById(boardID).orElseThrow(
                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다.")
        );

        CounselorBoardComment receiveComment = counselorBoardCommentRepository.findFirstByBoardIdOrderByCreatedAtDesc(counselorBoard.getId()).orElseThrow(
                () -> new IllegalArgumentException("댓글을 찾을 수 없습니다.")
        );

        Long memberId = counselorBoard.getMemberId();

        // DB 저장
        Notification notification = new Notification();
        notification.setCreatedAt(receiveComment.getCreatedAt());
        notification.setContent(receiveComment.getComment());
        notification.setEventSource(EventSource.COUNSELOR_BOARD);
        notification.setEventId(boardID);
        notification.setMemberId(memberId);
        notification.setIsDelete(false);
        notification.setIsRead(false);

        notificationRepository.save(notification);

        notifyComment(counselorBoard, receiveComment);
    }

    // 댓글 알림 - 게시글 작성자 에게
    public void notifyComment(CounselorBoard counselorBoard, CounselorBoardComment receiveComment) {
        Long memberId = counselorBoard.getMemberId();

        if (NotificationController.sseEmitters.containsKey(memberId)) {
            SseEmitter sseEmitter = NotificationController.sseEmitters.get(memberId);
            try {
                Map<String, String> eventData = new HashMap<>();
                eventData.put("message", "댓글이 달렸습니다");
                eventData.put("createdAt", receiveComment.getCreatedAt().toString());   // 댓글이 달린 시간
                eventData.put("content", receiveComment.getComment());                 // 댓글 내용

                sseEmitter.send(SseEmitter.event().name("comment").data(eventData));
            } catch (IOException e) {
                NotificationController.sseEmitters.remove(memberId);
            }
        }
    }
}
