package com.mamdaero.domain.member.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mamdaero.domain.member.repository.MemberRepository;
import com.mamdaero.domain.member.security.filter.JsonUsernamePasswordAuthenticationFilter;
import com.mamdaero.domain.member.security.filter.JsonUsernamePasswordAuthenticationFilterforCounselor;
import com.mamdaero.domain.member.security.filter.JwtAuthenticationProcessingFilter;
import com.mamdaero.domain.member.security.handler.LoginFailureHandler;
import com.mamdaero.domain.member.security.handler.LoginSuccessJWTProvideHandler;
import com.mamdaero.domain.member.security.service.JwtService;
import com.mamdaero.domain.member.security.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig
{
    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper;
    private final MemberRepository memberRepository;
    private final JwtService jwtService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception
    {
        http	.csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("frame-ancestors 'self' https://mamdaero.o-r.kr http://127.0.0.1:5500") // Content-Security-Policy 설정
                        )
                )
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/error", "/", "/p/**", "/chatlog/**", "/sub/**", "/pub/**",
                                "/signaling/**").permitAll()
                        .anyRequest().authenticated())
//                        .requestMatchers("/c/**").hasRole("상담사")
//                        .requestMatchers("/m/**").hasRole("내담자")
//                        .requestMatchers("/a/**").hasRole("관리자")
//                        .requestMatchers("/ca/**").hasAnyRole("상담사", "관리자")
//                        .requestMatchers("/ma/**").hasAnyRole("내담자", "관리자")
//                        .requestMatchers("/cm/**").hasAnyRole("상담사", "내담자")
//                        .requestMatchers("/error", "/", "/p/**").permitAll()
//                        .anyRequest().authenticated())
                .logout((logout) -> logout
                        .logoutSuccessUrl("/p/member/client-login")
                        .invalidateHttpSession(true))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        http
                .addFilterAfter(jsonUsernamePasswordLoginFilter(), LogoutFilter.class)
                .addFilterAfter(jsonUsernamePasswordAuthenticationFilterforCounselor(), LogoutFilter.class)
                .addFilterBefore(jwtAuthenticationProcessingFilter(), JsonUsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // 인증 관리자 관련 설정
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() throws Exception
    {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public static PasswordEncoder passwordEncoder()
    {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception
    {
        DaoAuthenticationProvider provider = daoAuthenticationProvider();//DaoAuthenticationProvider 사용
        return new ProviderManager(provider);
    }

    @Bean
    public LoginSuccessJWTProvideHandler loginSuccessJWTProvideHandler()
    {
        return new LoginSuccessJWTProvideHandler(jwtService, memberRepository);
    }

    @Bean
    public LoginFailureHandler loginFailureHandler(){
        return new LoginFailureHandler();
    }

    @Bean
    public JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordLoginFilter() throws Exception
    {
        JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordLoginFilter = new JsonUsernamePasswordAuthenticationFilter(objectMapper);
        jsonUsernamePasswordLoginFilter.setAuthenticationManager(authenticationManager());
        jsonUsernamePasswordLoginFilter.setAuthenticationSuccessHandler(loginSuccessJWTProvideHandler());
        jsonUsernamePasswordLoginFilter.setAuthenticationFailureHandler(loginFailureHandler());
        return jsonUsernamePasswordLoginFilter;
    }

    @Bean
    public JsonUsernamePasswordAuthenticationFilterforCounselor jsonUsernamePasswordAuthenticationFilterforCounselor() throws Exception
    {
        JsonUsernamePasswordAuthenticationFilterforCounselor jsonUsernamePasswordAuthenticationFilterforCounselor = new JsonUsernamePasswordAuthenticationFilterforCounselor(objectMapper);
        jsonUsernamePasswordAuthenticationFilterforCounselor.setAuthenticationManager(authenticationManager());
        jsonUsernamePasswordAuthenticationFilterforCounselor.setAuthenticationSuccessHandler(loginSuccessJWTProvideHandler());
        jsonUsernamePasswordAuthenticationFilterforCounselor.setAuthenticationFailureHandler(loginFailureHandler());
        return jsonUsernamePasswordAuthenticationFilterforCounselor;
    }

    @Bean
    public JwtAuthenticationProcessingFilter jwtAuthenticationProcessingFilter()
    {
        JwtAuthenticationProcessingFilter jsonUsernamePasswordLoginFilter = new JwtAuthenticationProcessingFilter(jwtService, memberRepository);
        return jsonUsernamePasswordLoginFilter;
    }
}