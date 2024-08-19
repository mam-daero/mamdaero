package com.mamdaero.domain.member.service;

import com.mamdaero.domain.member.dto.request.MemberRequestDto;
import com.mamdaero.domain.member.dto.response.MemberResponseDto;
import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.exception.MemberNotFoundException;
import com.mamdaero.domain.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberResponseDto find(final Long memberId) {
        Optional<Member> optionalMember = memberRepository.findById(memberId);

        if (optionalMember.isPresent()) {

            Member member = optionalMember.get();

            return MemberResponseDto.toDTO(member);
        }
        throw new MemberNotFoundException();
    }

    @Transactional
    public void modifyMember(final Long id, MemberRequestDto requestDto) {
        Optional<Member> optionalMember = memberRepository.findById(id);

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            member.update(requestDto);
        } else {
            throw new MemberNotFoundException();
        }
    }
}
