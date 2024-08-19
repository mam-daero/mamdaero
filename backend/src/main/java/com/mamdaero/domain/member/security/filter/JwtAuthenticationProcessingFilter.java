package com.mamdaero.domain.member.security.filter;

import com.mamdaero.domain.member.entity.Member;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.dto.UserDetailsImpl;
import com.mamdaero.domain.member.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationProcessingFilter extends OncePerRequestFilter
{
    private final JwtService jwtService;
    private final MemberRepository memberRepository;

    private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    private final String NO_CHECK_URL = "/p/member/client-login";
    private final String NO_CHECK_URL_CON = "/p/member/counselor-login";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {
        if(request.getRequestURI().equals(NO_CHECK_URL) || request.getRequestURI().equals(NO_CHECK_URL_CON))
        {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("dofilterInternal : {}", request);
        String refreshToken = jwtService
                .extractRefreshToken(request)
                .filter(jwtService::isTokenValid)
                .orElse(null);

        if(refreshToken != null)
        {
            checkRefreshTokenAndReIssueAccessToken(response, refreshToken);
            return;
        }
        log.info("JwtAuthenticationProcessingFilter : doFilterInternal OUT");
        checkAccessTokenAndAuthentication(request, response, filterChain);
        log.info("JwtAuthenticationProcessingFilter : What's Wrong?");
    }

    private void checkAccessTokenAndAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {
        log.info("checkAccessTokenAndAuthentication IN");
        log.info("request : " + request);
        // Extract access token
        Optional<String> accessTokenOpt = jwtService.extractAccessToken(request);
        if (accessTokenOpt.isEmpty()) {
            log.info("Access token not found");
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = accessTokenOpt.get();

        // Validate access token
        if (!jwtService.isTokenValid(accessToken)) {
            log.info("Invalid access token");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract email from the token
        Optional<String> emailOpt = jwtService.extractEmail(accessToken);
        if (emailOpt.isEmpty()) {
            log.info("Email not found in token");
            filterChain.doFilter(request, response);
            return;
        }

        String email = emailOpt.get();

        // Find member by email
        Optional<Member> memberOpt = memberRepository.findByEmail(email);
        if (memberOpt.isEmpty()) {
            log.info("No member found for email: " + email);
            filterChain.doFilter(request, response);
            return;
        }

        Member member = memberOpt.get();

        // Save authentication
        log.info("Saving authentication for member: " + member);
        saveAuthentication(member);

        filterChain.doFilter(request,response);
    }

    private void saveAuthentication(Member member)
    {
        log.info("save_authentication IN");
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(member.getRole()));
        UserDetailsImpl userDetails = new UserDetailsImpl(member, authorities);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,authoritiesMapper.mapAuthorities(userDetails.getAuthorities()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        log.info("ContextHolder : {}", authentication.getPrincipal());
        log.info("role : {}", authentication.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    private void checkRefreshTokenAndReIssueAccessToken(HttpServletResponse response, String refreshToken)
    {
        System.out.println("refreshToken = " + refreshToken);
        memberRepository.findByToken(refreshToken).ifPresent(member -> jwtService.sendAccessToken(response, jwtService.createAccessToken(member.getEmail())));
    }

    private void pr(Member st)
    {
        System.out.println(st);
    }
}
