package com.mamdaero.domain.member.security.apiresult.status;

import com.mamdaero.domain.member.security.apiresult.BaseErrorCode;
import com.mamdaero.domain.member.security.apiresult.ErrorReasonDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode
{
    //권한 및 서버 관련
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COM500", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST, "COM400", "잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COM401", "인증이 필요합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COM403", "금지된 요청입니다."),
    _LOGIN_FAILURE(HttpStatus.BAD_REQUEST, "COM400", "Login Fail"),

    //유저 관련
    MEMBER_NOT_FOUND(HttpStatus.BAD_REQUEST, "MEM001", "유저가 존재하지 않습니다."),
    MEMBER_PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "MEM002", "비밀번호가 일치하지 않습니다."),
    MEMBER_NOT_TOKEN(HttpStatus.BAD_REQUEST, "MEM003", "서버에 저장된 해당 유저의 Token이 없습니다."),
    NOT_MATCHING_MEMBER_TOKEN(HttpStatus.BAD_REQUEST, "MEM004", "토큰과 로그인 된 멤버가 일치하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReason()
    {
        return ErrorReasonDTO.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .build();
    }

    @Override
    public ErrorReasonDTO getReasonHttpStatus()
    {
        return ErrorReasonDTO.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .httpStatus(httpStatus)
                .build();
    }
}