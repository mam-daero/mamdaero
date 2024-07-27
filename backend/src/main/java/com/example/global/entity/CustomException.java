package com.example.global.entity;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final ExceptionConstants constants;

    public CustomException(ExceptionConstants constants) {
        super(constants.getCode()); // 상속 관계에서, super 사용 => 부모 클래스 초기, 부모 클래스의 기본 생성사 호출
        this.constants = constants;
    }

}
