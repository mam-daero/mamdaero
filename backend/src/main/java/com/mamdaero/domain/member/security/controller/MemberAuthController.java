package com.mamdaero.domain.member.security.controller;

import com.google.protobuf.Api;
import com.mamdaero.domain.counselor_board.dto.request.CounselorBoardRequest;
import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.apiresult.ApiResponse;
import com.mamdaero.domain.member.security.dto.request.*;
import com.mamdaero.domain.member.security.dto.response.*;
import com.mamdaero.domain.member.security.service.FindUserService;
import com.mamdaero.domain.member.security.service.MailService;
import com.mamdaero.domain.member.security.service.MemberAuthService;
import com.mamdaero.domain.work_schedule.service.WorkTimeService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hamcrest.core.Is;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@Slf4j
public class MemberAuthController
{
    private final MemberAuthService memberService;
    private final MailService mailService;
    private final FindUserService findUserService;
    private final WorkTimeService workTimeService;
    private final MemberRepository memberRepository;

    //유저 가입
    @PostMapping("/p/member/client-join")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MemberSignUpResponseDTO> memberJoin(@Valid @RequestBody MemberSignUpDTO request) throws Exception
    {
        memberService.memberJoin(request);
        MemberSignUpResponseDTO signupResponseDto = MemberSignUpResponseDTO.builder().email(request.getEmail()).isSuccess(true).build();
        return ApiResponse.onSuccess(signupResponseDto);
    }

    //상담사 가입
    @PostMapping("/p/member/counselor-join")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<MemberSignUpResponseDTO> counselorJoin(@RequestPart(name = "file", required = false) MultipartFile file,
                                                              @RequestPart("data") CounselorSignUpDTO request) throws Exception
    {
        memberService.counselorJoin(request, file);
        MemberSignUpResponseDTO signupResponseDto = MemberSignUpResponseDTO.builder().email(request.getEmail()).isSuccess(true).build();
        Optional<Member> member = memberRepository.findByEmail(signupResponseDto.getEmail());

        if(member.isPresent())
        {
            Long id = member.get().getId();
            workTimeService.createInitialWorkTimes(id);
        }
        return ApiResponse.onSuccess(signupResponseDto);
    }

    //닉네임 중복 체크
    @PostMapping("/p/member/nickname-check")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<IsDuplicateDTO> nicknameDuplicated(@RequestBody NicknameCheckDTO request) throws  Exception
    {
        String check = memberService.nicknameDuplicated(request);

        if (check.equals("true"))
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
    }

    //이메일 중복 체크
    @PostMapping("/p/member/email-check")
    public ApiResponse<IsDuplicateDTO> isDuplicated(@Valid @RequestBody EmailCheckRequestDTO request) throws Exception
    {
        String check = memberService.isDuplicated(request);

        if (check.equals("true"))
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
    }

    //상담사 이메일 인증 코드 발송
    @PostMapping("/p/member/counselor-email-request")
    public ApiResponse<IsDuplicateDTO> emailCheckRequest(@RequestBody EmailAuthRequestDTO request) throws Exception
    {
        boolean check = mailService.emailAuthRequest(request);

        if(check)
        {
            log.info("이메일 발송 됨!");
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        else
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
        }
    }

    //이메일 발송 인증 코드 검증
    @PostMapping("/p/member/counselor-email-auth")
    public ApiResponse<IsDuplicateDTO> emailCheckAuth(@RequestBody EmailAuthTokenRequstDTO request) throws Exception
    {
        boolean check = mailService.check_auth_token(request);
        if(check)
        {
            log.info("검증 됨!");
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        else
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
        }
    }

    @PatchMapping("/cm/member/password-modify")
    public ApiResponse<ResultDTO> passwordModify(@RequestBody PasswordResetDTO request) throws Exception
    {
        String email = findUserService.findMember().getMemberEmail();

        boolean check = memberService.modifyPassword(email, request);
        if(check)
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("변경 완료").build());
        }
        else
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("변경 실패").build());
        }
    }

    @PatchMapping("/cm/member/del")
    public ApiResponse<ResultDTO> deleteMember(@RequestBody DeleteMemberDTO request) throws Exception
    {
        boolean check = memberService.deleteUser(request);

        if(check)
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("탈퇴 완료").build());
        }
        else
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("탈퇴 실패").build());
        }
    }

    //비밀번호 재설정 인증번호 발송
    @PostMapping("/p/member/password-reset-request")
    public ApiResponse<IsDuplicateDTO> sendPasswordReset(@RequestBody MailPasswordResetDTO request) throws  Exception
    {
        boolean check = mailService.emailPasswordRequest(request);

        if(check)
        {
            log.info("비밀번호 재설정 이메일 발송");
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        else
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
        }
    }

    //비밀번호 재설정 인증번호 검증
    @PostMapping("/p/member/password-reset-verify")
    public ApiResponse<IsDuplicateDTO> checkPasswordReset(@RequestBody EmailAuthTokenRequstDTO request) throws Exception
    {
        boolean check = mailService.check_verify_token(request);
        if(check)
        {
            log.info("비밀번호 검증 됨!");
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(true).build());
        }
        else
        {
            return ApiResponse.onSuccess(IsDuplicateDTO.builder().isDuplicate(false).build());
        }
    }

    //비로그인 비밀번호 설정
    @PatchMapping("/p/member/password-reset")
    public ApiResponse<ResultDTO> resetPassword(@RequestBody PasswordEmailResetDTO request) throws  Exception
    {
        boolean check = memberService.noLoginPasswordReset(request);

        if(check)
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("비밀번호 재설정 완료").build());
        }
        else
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("비밀번호 재설정 실패").build());
        }
    }

    @PatchMapping("/cma/member/logout")
    public ApiResponse<ResultDTO> logOut(@RequestBody EmailCheckRequestDTO request) throws Exception
    {
        boolean check = memberService.logOutMember(request);

        if(check)
        {
            SecurityContextHolder.clearContext();
            return ApiResponse.onSuccess(ResultDTO.builder().message("로그아웃 완료").build());
        }
        else
        {
            return ApiResponse.onSuccess(ResultDTO.builder().message("유효하지 않은 토큰").build());
        }
    }

    @PatchMapping("/cma/member/reIssue")
    public ApiResponse<TokenResponseDTO> reIssueToken(@RequestBody EmailCheckRequestDTO request, HttpServletResponse response) throws Exception
    {
        TokenResponseDTO check = memberService.reissueToken(request, response);

        if(check != null)
        {
            return ApiResponse.onSuccess(TokenResponseDTO.builder().access_token(check.getAccess_token()).refresh_token(check.getRefresh_token()).message("정상 재발급").build());
        }
        else
        {
            return ApiResponse.onSuccess(TokenResponseDTO.builder().access_token("").refresh_token("").message("재발급 불가").build());
        }
    }

    @Data
    static class LoginRequestDto
    {
        @NotEmpty
        private String email;
        @NotEmpty
        private String password;
    }
}