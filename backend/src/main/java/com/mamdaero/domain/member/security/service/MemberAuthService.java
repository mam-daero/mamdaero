package com.mamdaero.domain.member.security.service;

import com.mamdaero.domain.member.entity.Counselor;
import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.repository.CounselorRepository;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.apiresult.ApiResponse;
import com.mamdaero.domain.member.security.dto.MemberInfoDTO;
import com.mamdaero.domain.member.security.dto.UserDetailsImpl;
import com.mamdaero.domain.member.security.dto.request.*;
import com.mamdaero.domain.member.security.dto.response.TokenResponseDTO;
import com.mamdaero.domain.member.security.entity.PasswordVerify;
import com.mamdaero.domain.member.security.repository.CounselorAuthRepository;
import com.mamdaero.domain.member.security.repository.PasswordVerifyRepository;
import com.mamdaero.global.service.FileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemberAuthService
{
    private final MemberRepository memberRepository;
    private final CounselorAuthRepository counselorAuthRepository;
    private final PasswordVerifyRepository passwordVerifyRepository;
    private final CounselorRepository counselorRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;
    private final FindUserService findUserService;
    private final JwtServiceImpl jwtService;

    //내담자 회원 가입
    public Long memberJoin(MemberSignUpDTO userRequestDto) throws Exception
    {
        Optional <Member> optionalMember = memberRepository.findByEmail(userRequestDto.getEmail());

        if(optionalMember.isPresent())
        {
            return null;
        }

        else
        {
            Member member = Member.builder()
                    .email(userRequestDto.getEmail())
                    .password(passwordEncoder.encode(userRequestDto.getPassword()))
                    .name(userRequestDto.getName())
                    .nickname(userRequestDto.getNickname())
                    .birth(userRequestDto.getBirth())
                    .tel(userRequestDto.getTel())
                    .gender(userRequestDto.getGender())
                    .role("내담자")
                    .memberStatus(false)
                    .build();

            Long id = memberRepository.save(member).getId();
            return id;
        }
    }

    //상담사 회원 가입
    public Long counselorJoin(CounselorSignUpDTO userRequestDto, MultipartFile file) throws Exception
    {
        Optional <Member> optionalMember = memberRepository.findByEmail(userRequestDto.getEmail());

        if(optionalMember.isPresent())
        {
            return null;
        }

        else
        {
            Counselor counselor = Counselor.builder()
                    .email(userRequestDto.getEmail())
                    .password(passwordEncoder.encode(userRequestDto.getPassword()))
                    .name(userRequestDto.getName())
                    .nickname(userRequestDto.getName())
                    .birth(userRequestDto.getBirth())
                    .tel(userRequestDto.getTel())
                    .gender(userRequestDto.getGender())
                    .role("상담사")
                    .memberStatus(false)
                    .address(userRequestDto.getAddress())
                    .level(userRequestDto.getLevel())
                    .license(userRequestDto.getLicense())
                    .intro(userRequestDto.getIntro())
                    .introDetail(userRequestDto.getIntroDetail())
                    .img(null)
                    .build();

            Long id = counselorRepository.save(counselor).getId();
            if(file != null)
            {
                String fileUrl = fileService.saveProfile(file, id);
                counselorRepository.updateProfileImg(fileUrl, id.toString());
            }
            return id;
        }
    }

    public String isDuplicated(EmailCheckRequestDTO request)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isExistByEmail(request.getEmail()))
        {
            return "true";
        }
        return "false";
    }

    public String nicknameDuplicated(NicknameCheckDTO request)
    {
        if(isExistByNickname(request.getNickname()))
        {
            return "true";
        }
        return "false";
    }

    public boolean modifyPassword(String email, PasswordResetDTO request)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        log.info("the authentication is " + authentication.getName() + " ithign : " + authentication.getAuthorities());
        log.info("user : {}", authentication.getPrincipal());
        log.info("user2 : {}", user.toString());
        log.info("userId" + user.getId() + "userAuthority : " + user.getAuthorities().toString());

        Optional<Member> member = memberRepository.findByEmail(email);
        if(member.isEmpty())
        {
            log.info("hi");
            return false;
        }
        String pw = member.get().getPassword();

        if(!passwordEncoder.matches(request.getCurrentPassword(), pw))
        {
            return false;
        }
        memberRepository.modifyPassword(passwordEncoder.encode(request.getNewPassword()), email);
        return true;
    }

    public boolean deleteUser(DeleteMemberDTO request)
    {
        Optional <Member> member = memberRepository.findByEmail(request.getEmail());
        MemberInfoDTO membercheck = findUserService.findMember();

        if(member.isEmpty() || !membercheck.getMemberEmail().equals(request.getEmail()))
        {
            return false;
        }
        else
        {
            memberRepository.modifyUserStatus(request.getEmail());
            return true;
        }
    }

    public boolean noLoginPasswordReset(PasswordEmailResetDTO request)
    {
        PasswordVerify passwordVerify = passwordVerifyRepository.findByEmail(request.getEmail());

        if(passwordVerify.getVerifyToken() == null)
        {
            return false;
        }
        log.info(passwordVerify.getEmail());
        passwordVerifyRepository.deleteByEmail(passwordVerify.getEmail());
        memberRepository.modifyPassword(passwordEncoder.encode(request.getPassword()), request.getEmail());
        return true;
    }

    public boolean logOutMember(EmailCheckRequestDTO request)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String Current_email = authentication.getName();

        if(Current_email.equals(request.getEmail()))
        {
            jwtService.destroyRefreshToken(Current_email);
            return true;
        }
        return false;
    }

    public TokenResponseDTO reissueToken(EmailCheckRequestDTO request, HttpServletResponse response)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication.getName().equals(request.getEmail()))
        {
            String acc_token = jwtService.createAccessToken(request.getEmail());
            String ref_token = jwtService.createRefreshToken();
            jwtService.updateRefreshToken(request.getEmail(), ref_token);
            jwtService.sendAccessAndRefreshToken(response, acc_token, ref_token);
            return TokenResponseDTO.builder().access_token(acc_token).refresh_token(ref_token).message("").build();
        }
        else
        {
            return null;
        }
    }

    public boolean isExistByEmail(String email)
    {
        return memberRepository.existsByEmail(email);
    }

    public boolean isExistByNickname(String nickname)
    {
        return memberRepository.existsByNickname(nickname);
    }
}