package com.mamdaero.domain.member.security.util;

import com.mamdaero.domain.member.security.dto.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class SecurityUtil
{
    public static String getLoginEmail()
    {
        log.info("SecurityUtil : {}", SecurityContextHolder.getContext().getAuthentication());
        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
            return null;
        }
        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("SecurityUtil_USERNAME : {}", user.getEmail());
        log.info("SecurityUtil_EMAIL : {}", user.getMember().getEmail());
        log.info("SecurityUtil_PASSWORD : {}", user.getPassword());
        return user.getMember().getEmail();
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        return user.getUsername();
    }
}