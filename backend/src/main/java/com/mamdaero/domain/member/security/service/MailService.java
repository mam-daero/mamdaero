package com.mamdaero.domain.member.security.service;

import com.mamdaero.domain.consult.repository.ConsultRepository;
import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.dto.request.EmailAuthRequestDTO;
import com.mamdaero.domain.member.security.dto.request.EmailAuthTokenRequstDTO;
import com.mamdaero.domain.member.security.dto.request.MailPasswordResetDTO;
import com.mamdaero.domain.member.security.entity.CounselorAuth;
import com.mamdaero.domain.member.security.entity.PasswordVerify;
import com.mamdaero.domain.member.security.repository.CounselorAuthRepository;
import com.mamdaero.domain.member.security.repository.PasswordVerifyRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MailService
{
    @Autowired
    private final JavaMailSender javaMailSender;
    private final CounselorAuthRepository counselorAuthRepository;
    private final PasswordVerifyRepository  passwordVerifyRepository;
    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;
    @Autowired
    private ConsultRepository consultRepository;
    @Autowired
    private MemberRepository memberRepository;

    public boolean emailAuthRequest(EmailAuthRequestDTO request)
    {
        CounselorAuth email_check = counselorAuthRepository.findByInfo(request.getEmail(), request.getLicense(), request.getCounselorName());

        if(email_check == null)
        {
            log.info("Email check failed");
            return false;
        }
        else
        {
            String temp_token = createTempPassword();
            counselorAuthRepository.updatePassword(temp_token, request.getEmail());
            CounselorAuth counselorAuth = counselorAuthRepository.findByEmail(request.getEmail(), temp_token);

            if(counselorAuth == null)
            {
                log.info("Email Auth failed");
                return false;
            }
            sendMail(temp_token, request.getEmail());
            return true;
        }
    }

    //랜덤 비밀번호 생성
    public String createTempPassword()
    {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };
        String str = "!";

        int idx = 0;
        for (int i = 0; i < 8; i++)
        {
            idx = (int) (charSet.length * Math.random());
            str += charSet[idx];
        }
        return str;
    }

    //Mail 날려버림
    public void sendMail(String token, String email)
    {
        MimeMessage message = javaMailSender.createMimeMessage();
        try
        {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, false, "UTF-8");
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("MAMDAERO! 상담사용 인증번호 입니다!");
            mimeMessageHelper.setText(setContext(token), true);
            mimeMessageHelper.setFrom(fromEmail);
            log.info("email : {}",email);
            javaMailSender.send(message);
        }
        catch (MessagingException e)
        {
            e.printStackTrace();
        }
    }

    //내용 세팅
    public String setContext(String token)
    {
        Context context = new Context();
        context.setVariable("token", token);
        return templateEngine.process("mail", context);
    }

    public boolean check_auth_token(EmailAuthTokenRequstDTO request)
    {
        String check_email = counselorAuthRepository.verifyAuthToken(request.getAuth_token(), request.getEmail());
        if(check_email == null)
        {
            return false;
        }
        counselorAuthRepository.updatePassword(null, request.getEmail());
        return true;
    }

    public boolean emailPasswordRequest(MailPasswordResetDTO request)
    {
        Optional<Member> check = memberRepository.findByEmailforPW(request.getEmail(), request.getName());

        if(check.isPresent())
        {
            String temp_token = createTempPassword();
            PasswordVerify exist_email_check = passwordVerifyRepository.findByEmail(request.getEmail());

            if(exist_email_check == null)
            {
                PasswordVerify passwordVerify = new PasswordVerify();
                passwordVerify.setEmail(request.getEmail());
                passwordVerify.setVerifyToken(temp_token);
                passwordVerifyRepository.save(passwordVerify);
            }
            else
            {
                passwordVerifyRepository.updateVeryfiy(temp_token, request.getEmail());
            }
            sendPasswordMail(temp_token, request.getEmail());
            return true;
        }
        else
        {
            log.info("info check failed");
            return false;
        }
    }

    //Password Mail 날려버림
    public void sendPasswordMail(String token, String email)
    {
        MimeMessage message = javaMailSender.createMimeMessage();
        try
        {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, false, "UTF-8");
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("MAMDAERO! 비밀번호 재설정용 인증번호 입니다!");
            mimeMessageHelper.setText(setPasswordContext(token), true);
            mimeMessageHelper.setFrom(fromEmail);
            log.info("email : {}",email);
            javaMailSender.send(message);
        }
        catch (MessagingException e)
        {
            e.printStackTrace();
        }
    }

    //PW 내용 세팅
    public String setPasswordContext(String token)
    {
        Context context = new Context();
        context.setVariable("token", token);
        return templateEngine.process("mailPW", context);
    }

    public boolean check_verify_token(EmailAuthTokenRequstDTO request)
    {
        String check_email = passwordVerifyRepository.verifyToken(request.getAuth_token(), request.getEmail());
        if(check_email == null)
        {
            return false;
        }
        return true;
    }
}
