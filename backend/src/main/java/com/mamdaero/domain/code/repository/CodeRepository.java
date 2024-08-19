package com.mamdaero.domain.code.repository;

import com.mamdaero.domain.code.dto.response.CodeResponse;
import com.mamdaero.domain.code.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CodeRepository extends JpaRepository<Code, Long> {
    @Query("SELECT new com.mamdaero.domain.code.dto.response.CodeResponse(c.id, c.name) " +
            "FROM Code c JOIN c.codeGroup cg WHERE cg.name = :name")
    List<CodeResponse> findCodesByCodeGroupName(@Param("name") String name);

    Code findCodeById(Long id);
}
