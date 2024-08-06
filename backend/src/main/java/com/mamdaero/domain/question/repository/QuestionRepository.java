package com.mamdaero.domain.question.repository;

import com.mamdaero.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.isDelete = false ORDER BY q.id limit 1")
    Question findQuestionOne();
}
