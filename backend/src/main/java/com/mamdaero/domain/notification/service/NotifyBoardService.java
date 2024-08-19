package com.mamdaero.domain.notification.service;

import com.mamdaero.domain.board.entity.Board;
import com.mamdaero.domain.board.entity.BoardComment;
import com.mamdaero.domain.board.repository.BoardCommentRepository;
import com.mamdaero.domain.board.repository.BoardRepository;
import com.mamdaero.domain.notification.controller.NotificationController;
import com.mamdaero.domain.notification.entity.EventSource;
import com.mamdaero.domain.notification.entity.Notification;
import com.mamdaero.domain.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotifyBoardService {

    private final NotificationRepository notificationRepository;
    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;

    public void notifyCommentSave(Long boardID) {
        Board board = boardRepository.findById(boardID).orElseThrow(
                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다.")
        );

        BoardComment comment = boardCommentRepository.findFirstByBoardIdOrderByCreatedAtDesc(board.getId()).orElseThrow(
                () -> new IllegalArgumentException("댓글을 찾을 수 없습니다.")
        );

        Long memberId = board.getMemberId();

        // DB 저장
        Notification notification = new Notification();
        notification.setCreatedAt(comment.getCreatedAt());
        notification.setContent(comment.getComment());
        notification.setEventSource(EventSource.BOARD);
        notification.setEventId(boardID);
        notification.setMemberId(memberId);
        notification.setIsDelete(false);
        notification.setIsRead(false);

        notificationRepository.save(notification);

        notifyComment(board, comment);
    }

    // 댓글 알림 - 게시글 작성자 에게
    public void notifyComment(Board board, BoardComment comment) {
        Long memberId = board.getMemberId();

        if (NotificationController.sseEmitters.containsKey(memberId)) {
            SseEmitter sseEmitter = NotificationController.sseEmitters.get(memberId);
            try {
                Map<String, String> eventData = new HashMap<>();
                eventData.put("message", "댓글이 달렸습니다");
                eventData.put("createdAt", comment.getCreatedAt().toString());
                eventData.put("content", comment.getComment());

                sseEmitter.send(SseEmitter.event().name("comment").data(eventData));
            } catch (IOException e) {
                NotificationController.sseEmitters.remove(memberId);
            }
        }
    }
}
