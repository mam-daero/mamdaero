package com.example.mamdaero.counselor_item.repository;

import com.example.mamdaero.counselor_item.entity.CounselorItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselorItemRepository extends JpaRepository<CounselorItem, Long> {

    boolean existsByCounselorId(long counselorId);
    List<CounselorItem> findByCounselorId(long counselorItemId);
}