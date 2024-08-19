import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MyCounselBar from '@/components/navigation/MyCounselBar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { FaVideo, FaMicrophone, FaRecordVinyl, FaDesktop } from 'react-icons/fa';
import fox from '@/assets/chat_fox.png';
import prince from '@/assets/chat_prince.png';
import Button from '@/components/button/Button';

interface IceMessage {
  key: string;
  body: RTCIceCandidateInit;
}

interface OfferAnswerMessage {
  key: string;
  body: RTCSessionDescriptionInit;
}

const ClientFaceChat: React.FC = () => {
  const { counsultId: counselId = '', memberId: counselorId = '' } = useParams<{
    counsultId: string;
    memberId: string;
  }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('초기화 중...');
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [participants, setParticipants] = useState<string[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const dataChannelsRef = useRef<{ [key: string]: RTCDataChannel }>({});
  const chatInputRef = useRef<HTMLInputElement>(null);

  const myKey = useRef<string>(Math.random().toString(36).substring(2, 11));
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!counselId || !counselorId) {
      console.error('Invalid counsel or client ID');
      return;
    }
    console.log('Starting camera...');
    startCam();
    console.log('Connecting to socket...');
    connectSocket();
    return () => {
      console.log('Cleaning up...');
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    };
  }, [counselId, counselorId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const startCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('카메라 또는 마이크 접근 오류');
    }
  };

  const connectSocket = () => {
    const socket = new SockJS('https://mamdaero.o-r.kr/api/signaling');
    stompClientRef.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: str => {
        console.log(str);
      },
      onConnect: async () => {
        console.log('Connected to WebRTC server');
        setConnectionStatus('서버에 연결됨. 다른 참가자 대기 중...');
        await subscribeToTopics();
        const stream = await startCam();
        if (stream) {
          registerParticipant();
        }
      },
      onDisconnect: () => {
        console.log('Disconnected from WebRTC server');
        setConnectionStatus('서버와 연결이 끊어졌습니다.');
      },
      onStompError: frame => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setConnectionStatus('서버 연결 오류');
      },
    });

    stompClientRef.current.activate();
  };

  const subscribeToTopics = async () => {
    if (!stompClientRef.current) return;

    await stompClientRef.current.subscribe(
      `/topic/peer/iceCandidate/${myKey.current}/${counselId}`,
      message => {
        const iceMessage = JSON.parse(message.body) as IceMessage;
        const pc = peerConnectionsRef.current[iceMessage.key];
        if (pc) {
          pc.addIceCandidate(new RTCIceCandidate(iceMessage.body));
        }
      }
    );

    await stompClientRef.current.subscribe(
      `/topic/peer/offer/${myKey.current}/${counselId}`,
      message => {
        const offerMessage = JSON.parse(message.body) as OfferAnswerMessage;
        handleOffer(offerMessage.key, offerMessage.body);
      }
    );

    await stompClientRef.current.subscribe(
      `/topic/peer/answer/${myKey.current}/${counselId}`,
      message => {
        const answerMessage = JSON.parse(message.body) as OfferAnswerMessage;
        const pc = peerConnectionsRef.current[answerMessage.key];
        if (pc) {
          pc.setRemoteDescription(new RTCSessionDescription(answerMessage.body));
        }
      }
    );

    await stompClientRef.current.subscribe(`/topic/participants/${counselId}`, message => {
      const newParticipants = JSON.parse(message.body) as string[];
      setParticipants(newParticipants);
      newParticipants.forEach(participantId => {
        if (participantId !== myKey.current && !peerConnectionsRef.current[participantId]) {
          createPeerConnection(participantId);
        }
      });
    });
  };

  const registerParticipant = () => {
    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: `/app/register/${counselId}`,
        body: JSON.stringify({ key: myKey.current }),
      });
    }
  };

  const createPeerConnection = (participantId: string) => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[participantId] = peerConnection;

    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.onicecandidate = event => {
      if (event.candidate && stompClientRef.current) {
        stompClientRef.current.publish({
          destination: `/app/peer/iceCandidate/${participantId}/${counselId}`,
          body: JSON.stringify({
            key: myKey.current,
            body: event.candidate,
          }),
        });
      }
    };

    peerConnection.ontrack = event => {
      console.log('Received remote track from', participantId);
      setRemoteStreams(prev => ({
        ...prev,
        [participantId]: event.streams[0],
      }));
      setConnectionStatus('피어와 연결됨. 화상 채팅 중...');
    };

    // 데이터 채널 생성
    const dataChannel = peerConnection.createDataChannel('chat');
    dataChannelsRef.current[participantId] = dataChannel;
    dataChannel.onopen = () => console.log('Data channel opened with', participantId);
    dataChannel.onmessage = event => {
      console.log('Received message from', participantId, ':', event.data);
      setChatLog(prev => [...prev, `${participantId}: ${event.data}`]);
    };

    peerConnection.ondatachannel = event => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = messageEvent => {
        console.log('Received message on data channel from', participantId, ':', messageEvent.data);
        setChatLog(prev => [...prev, `${participantId}: ${messageEvent.data}`]);
      };
    };

    sendOffer(participantId);
  };

  const handleOffer = async (participantId: string, offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionsRef.current[participantId]) {
      createPeerConnection(participantId);
    }
    const peerConnection = peerConnectionsRef.current[participantId];
    if (!peerConnection || !stompClientRef.current) return;

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      stompClientRef.current.publish({
        destination: `/app/peer/answer/${participantId}/${counselId}`,
        body: JSON.stringify({
          key: myKey.current,
          body: answer,
        }),
      });
    } catch (error) {
      console.error('Error handling offer:', error);
      setConnectionStatus('연결 설정 중 오류 발생');
    }
  };

  const sendOffer = async (participantId: string) => {
    const peerConnection = peerConnectionsRef.current[participantId];
    if (!peerConnection || !stompClientRef.current) return;

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      stompClientRef.current.publish({
        destination: `/app/peer/offer/${participantId}/${counselId}`,
        body: JSON.stringify({
          key: myKey.current,
          body: offer,
        }),
      });
    } catch (error) {
      console.error('Error sending offer:', error);
      setConnectionStatus('연결 제안 중 오류 발생');
    }
  };

  const handleSendChatMessage = () => {
    if (message.trim()) {
      Object.values(dataChannelsRef.current).forEach(dc => {
        if (dc.readyState === 'open') {
          dc.send(message);
        }
      });
      setChatLog(prev => [...prev, `나: ${message}`]);
      setMessage('');
      chatInputRef.current?.focus();
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChatMessage();
    }
  };

  if (!counselId || !counselorId) {
    return <div>Error: Invalid counsel or client ID</div>;
  }
  const handleGoBack = () => {
    const confirmExit = window.confirm('상담을 종료하시겠습니까?');
    if (confirmExit) {
      navigate('/');
    }
  };

  const toggleCamera = () => {
    // 카메라 on/off 로직 구현
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    // 마이크 on/off 로직 구현
    setIsMicOn(!isMicOn);
  };

  const toggleRecording = () => {
    // 녹화 시작/중지 로직 구현
    setIsRecording(!isRecording);
  };

  const toggleScreenShare = () => {
    // 화면 공유 시작/중지 로직 구현
    setIsScreenSharing(!isScreenSharing);
  };

  if (!counselId || !counselorId) {
    return <div>Error: Invalid counsel or client ID</div>;
  }

  return (
    <div className="flex flex-col min-h-screen justify-start">
      <MyCounselBar
        title1="맘대로"
        title2="화상채팅"
        subtitle={`상담 ID: ${counselId}, 상태: ${connectionStatus}`}
        user="client"
        buttonLabel="메인화면 돌아가기"
        buttonPath="/"
      />
      <div className="bg-white flex flex-1 p-6 mr-12 ml-12 mb-12 space-x-4 rounded-lg">
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-md relative">
            {Object.entries(remoteStreams).length === 0 ? (
              <div className="w-full h-full rounded-lg bg-gray-300 flex items-center justify-center">
                <p>상담사 기다리는 중...</p>
              </div>
            ) : (
              Object.entries(remoteStreams).map(([participantId, stream]) => (
                <div key={participantId} className="relative w-full h-full">
                  <video
                    ref={el => {
                      if (el) el.srcObject = stream;
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full rounded-lg bg-gray-300 object-cover"
                  />
                </div>
              ))
            )}
            <img src={prince} alt="Prince" className="absolute bottom-0 left-0 w-1/6 z-10" />
            <img src={fox} alt="Prince" className="absolute bottom-0 right-0 w-1/6 z-10" />
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={toggleCamera}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs ${
                isCameraOn ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              <FaVideo className="mr-1.5 text-sm" />
              <span>{isCameraOn ? '비디오 끄기' : '비디오 켜기'}</span>
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs ${
                isMicOn ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              <FaMicrophone className="mr-1.5 text-sm" />
              <span>{isMicOn ? '마이크 끄기' : '마이크 켜기'}</span>
            </button>
            <button
              onClick={toggleRecording}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs ${
                isRecording ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              <FaRecordVinyl className="mr-1.5 text-sm" />
              <span>{isRecording ? '녹음 끄기' : '녹음 켜기'}</span>
            </button>
          </div>
        </div>
        <div className="w-1/3 flex flex-col">
          <div className="h-1/3 mb-4 bg-gray-100 rounded-lg shadow-md relative overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 bg-gray-100 max-h-72 rounded-lg shadow-md flex flex-col overflow-hidden">
            <div className="pl-4 pt-2 border-b">
              <h2 className="text-base font-semibold">대화창</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-1">
              {chatLog.map((msg, index) => {
                const [sender, content] = msg.split(': ');
                const isSelf = sender === '나';
                return (
                  <div
                    key={index}
                    className={`chat ${isSelf ? 'chat-end' : 'chat-start'} w-full mb-2`}
                  >
                    <div className="chat-header text-xs">
                      {sender}
                      <time className="text-xs opacity-50 ml-1">방금</time>
                    </div>
                    <div className="chat-bubble chat-bubble-primary break-words text-sm max-w-[80%]">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-2 border-t flex">
              <input
                type="text"
                ref={chatInputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요."
                className="flex-grow px-2 py-1 border rounded-lg mr-2 text-sm"
              />
              <Button label="전송" onClick={handleSendChatMessage} size="검색" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFaceChat;
