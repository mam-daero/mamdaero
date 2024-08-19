package com.mamdaero.domain.question.service;

import com.mamdaero.domain.question.dto.response.QuestionResponse;
import com.mamdaero.domain.question.entity.Question;
import com.mamdaero.domain.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private static Long QuestionId = null;

    @Transactional
    public void create(String content) {
        questionRepository.save(new Question(content));
    }

    public QuestionResponse getQuestion() {
        log.info("id: " + QuestionId);

        Question question = questionRepository.findQuestionOne();

        if (question == null) {
            return new QuestionResponse(0L, "준비된 질문이 없음");
        }
        
        return new QuestionResponse(question.getId(), question.getContent());
    }

    @Scheduled(cron = "0 0 0 * * ?")
//    @Scheduled(cron = "0 0 0 */7 * ?")
    @Transactional
    public void nextQuestion() {
        Question question = questionRepository.findQuestionOne();

        if (question == null) {
            return;
        }

        QuestionId = question.getId();

        log.info("질문 변경: " + QuestionId);
        question.setIsDelete();
    }
}
