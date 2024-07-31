package com.mamdaero.domain.postit.repository;

import com.mamdaero.domain.postit.entity.Postit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoistitRepository extends JpaRepository<Postit, Long> {
}
