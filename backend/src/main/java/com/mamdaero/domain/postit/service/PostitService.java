package com.mamdaero.domain.postit.service;

import com.mamdaero.domain.postit.repository.PoistitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostitService {

    private final PoistitRepository poistitRepository;


}