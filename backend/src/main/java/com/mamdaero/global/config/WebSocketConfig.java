package com.mamdaero.global.config;

import com.mamdaero.domain.consult.handler.AudioWebSocketHandler;
import org.apache.tomcat.websocket.server.WsContextListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer, WebSocketConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    private final AudioWebSocketHandler audioWebSocketHandler;

    @Autowired
    public WebSocketConfig(AudioWebSocketHandler audioWebSocketHandler) {
        this.audioWebSocketHandler = audioWebSocketHandler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub"); // broker url 설정
        config.setApplicationDestinationPrefixes("/pub"); // send url 설정
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/signaling")// webSokcet 접속시 endpoint 설정
                .setAllowedOriginPatterns("*") // CORS 설정 ( * 는 모두 허용 )
                .withSockJS() // SockJS 설정: WebSocket을 지원하지 않는 브라우저에 대한 대안
                .setInterceptors(new HttpSessionHandshakeInterceptor());
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    String sessionId = accessor.getSessionId();
                    logger.info("DISCONNECT message received for session ID: " + sessionId);
                    // 세션 정리 로직이 필요한 경우 여기에 추가
                }

                logger.info("Received STOMP message: " + accessor.getCommand());
                logger.info("Headers: " + accessor.toNativeHeaderMap());
                return message;
            }
        });
    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                logger.info("Sending STOMP message: " + accessor.getCommand());
                logger.info("Headers: " + accessor.toNativeHeaderMap());

                return message;
            }
        });
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(audioWebSocketHandler, "/audio")
                .setAllowedOriginPatterns("*");
    }

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return factory -> factory.addContextCustomizers(context -> {
            context.addApplicationListener(WsContextListener.class.getName());
            context.addParameter("org.apache.tomcat.websocket.textBufferSize", "300000");  // Set text buffer size
            context.addParameter("org.apache.tomcat.websocket.binaryBufferSize", "300000"); // Set binary buffer size
        });
    }
}
