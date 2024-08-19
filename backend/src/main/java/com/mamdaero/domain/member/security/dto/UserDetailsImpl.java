package com.mamdaero.domain.member.security.dto;

import com.mamdaero.domain.member.entity.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserDetailsImpl implements UserDetails
{
    private final Member member;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Member member, Collection<? extends GrantedAuthority> authorities)
    {
        this.member = member;
        this.authorities = authorities;
    }

    public Member getMember()
    {
        return member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return authorities;
    }

    public Long getId()
    {
        return member.getId();
    }

    @Override
    public String getPassword()
    {
        return member.getPassword();
    }

    @Override
    public String getUsername()
    {
        return member.getEmail();
    }

    public String getEmail()
    {
        return member.getEmail();
    }

    @Override
    public boolean isAccountNonExpired()
    {
        return true;
    }

    @Override
    public boolean isAccountNonLocked()
    {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired()
    {
        return true;
    }

    @Override
    public boolean isEnabled()
    {
        return true;
    }
}