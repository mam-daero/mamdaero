package com.mamdaero.domain.member.controller;

import com.mamdaero.domain.member.dto.request.MemberRequestDto;
import com.mamdaero.domain.member.dto.response.MemberResponseDto;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final FindUserService findUserService;

    @GetMapping(value = "/m/member")
    public ResponseEntity<?> getMember() {

        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {

            Long memberId = findUserService.findMemberId();

            MemberResponseDto responseDto = memberService.find(memberId);

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PatchMapping(value = "/m/member", consumes = "application/json")
    public ResponseEntity<?> patchMemberJson(@RequestBody MemberRequestDto memberRequestDto) {
        if (Objects.equals(findUserService.findMemberRole(), "내담자") || Objects.equals(findUserService.findMemberRole(), "상담사")) {

            Long memberId = findUserService.findMemberId();

            memberService.modifyMember(memberId, memberRequestDto);

            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
