import Button from '@/components/button/Button';
import MyCounselBar from '@/components/navigation/MyCounselBar';
import React, { useState, useEffect, useRef, memo } from 'react';
import { FaMicrophone, FaSyncAlt, FaVideo } from 'react-icons/fa';
import fox from '@/assets/chat_fox.png';
import prince from '@/assets/chat_prince.png';
import { Client } from '@stomp/stompjs';
import { useWebRTCStore } from '@/stores/webRTCStore';
import useMemberStore from '@/stores/memberStore';
import SockJS from 'sockjs-client';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

interface Chat {
  sender: number;
  data: string;
  time: string;
}

export const ClientFaceChat2: React.FC = () => {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const [stompClient, setStompClient] = useState<Client>(new Client());
  const [otherKeyList, setOtherKeyList] = useState<string[]>([]);
  const [pcListMap, setPcListMap] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [dataChannels, setDataChannels] = useState<Map<string, RTCDataChannel>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatLog, setChatLog] = useState<Chat[]>([]);

  const pendingCandidatesMap = new Map<string, RTCIceCandidateInit[]>();

  const { reservationId } = useParams();
  const { id: memberId } = useMemberStore();

  // 메시지 전송
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { messageInput } = e.target as typeof e.target & {
      messageInput: HTMLInputElement;
    };
    if (!messageInput.value) return;
    dataChannels.forEach(channel => {
      const msg = {
        sender: memberId,
        data: messageInput.value,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      channel.send(JSON.stringify(msg));
    });
    addChatLog({
      sender: memberId!,
      data: messageInput.value,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    messageInput.value = '';
  };

  const addChatLog = (msg: Chat) => {
    setChatLog(prev => [msg, ...prev]);
    console.log(chatLog);
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(!isMicOn);
    }
  };

  const connectMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setIsCameraOn(true);
    setIsMicOn(true);
    setLocalStream(stream);
  };

  const addRemoteStream = (key: string, stream: MediaStream) => {
    const streams = new Map<string, MediaStream>(remoteStreams);
    streams.set(key, stream);
    setRemoteStreams(streams);
  };

  const disconnectMedia = () => {
    if (!localStream) return;
    localStream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setIsCameraOn(false);
    setIsMicOn(false);
  };
  // 트랙을 수신
  const onTrack = (event: RTCTrackEvent, otherKey: string) => {
    console.log(`상대방 ${otherKey}로부터 받은 트랙`); // 상대방으로부터 받은 트랙을 출력합니다.
    console.log(event.streams[0]);
    addRemoteStream(otherKey, event.streams[0]);
    if (remoteVideoRef.current && event.streams[0].getTracks().length > 0) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  // 피어 연결 생성
  const createPeerConnection = (otherKey: string) => {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    const pc = new RTCPeerConnection(configuration);

    try {
      pc.addEventListener('icecandidate', event => {
        onIceCandidate(event, otherKey);
      });
      pc.addEventListener('track', event => {
        onTrack(event, otherKey);
      });
      pc.addEventListener('datachannel', event => {
        const receiveChannel = event.channel;
        receiveChannel.onmessage = event => {
          //   addChatLog(JSON.parse(event.data));
        };
        dataChannels.set(otherKey, receiveChannel); // 받은 DataChannel을 저장
      });
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

      // DataChannel 생성
      const dataChannel = pc.createDataChannel('chat');
      dataChannel.onmessage = event => {
        addChatLog(JSON.parse(event.data));
      };
      dataChannels.set(otherKey, dataChannel);

      console.log(`키 ${otherKey}에 대한 PeerConnection 생성 완료`); // PeerConnection 생성 완료 메시지를 출력합니다.
    } catch (error) {
      console.error(`키 ${otherKey}에 대한 PeerConnection 생성 실패:`, error); // PeerConnection 생성 실패 시 오류를 출력합니다.
    }
    return pc;
  };

  // ICE 후보자 전송
  const onIceCandidate = (event: RTCPeerConnectionIceEvent, otherKey: string) => {
    if (!stompClient) return;

    if (event.candidate) {
      const candidateMessage = {
        key: memberId,
        body: event.candidate,
      };

      console.log(`상대방 ${otherKey}에게 전송할 ICE 후보자 메시지:`, candidateMessage);
      stompClient.publish({
        destination: `/sub/peer/iceCandidate/${otherKey}/${reservationId}`,
        body: JSON.stringify(candidateMessage),
      });
    } else {
      console.log('모든 ICE 후보자가 전송되었습니다');
    }
  };

  // offer 생성 및 전송
  const sendOffer = (pc: RTCPeerConnection, otherKey: string) => {
    if (!stompClient) return;

    pc.createOffer()
      .then(offer => {
        console.log('생성된 Offer:', offer);
        setLocalAndSendMessage(pc, offer);
        const offerMessage = {
          key: memberId,
          body: offer,
        };

        console.log(`상대방 ${otherKey}에게 전송할 Offer 메시지:`, offerMessage);
        stompClient.publish({
          destination: `/sub/peer/offer/${otherKey}/${reservationId}`,
          body: JSON.stringify(offerMessage),
        });
      })
      .catch(error => {
        console.error('offer 생성 오류:', error); // offer 생성 오류를 출력합니다.
      });
  };

  // answer 생성 및 전송
  const sendAnswer = (pc: RTCPeerConnection, otherKey: string) => {
    if (!stompClient) return;

    pc.createAnswer()
      .then(answer => {
        console.log('생성된 Answer:', answer);
        setLocalAndSendMessage(pc, answer);
        const answerMessage = {
          key: memberId,
          body: answer,
        };

        console.log(`상대방 ${otherKey}에게 전송할 Answer 메시지:`, answerMessage);
        stompClient.publish({
          destination: `/sub/peer/answer/${otherKey}/${reservationId}`,
          body: JSON.stringify(answerMessage),
        });
      })
      .catch(error => {
        console.error('answer 생성 오류:', error); // answer 생성 오류를 출력합니다.
      });
  };

  // 로컬 설명 설정 및 전송
  const setLocalAndSendMessage = (
    pc: RTCPeerConnection,
    sessionDescription: RTCSessionDescriptionInit
  ) => {
    pc.setLocalDescription(sessionDescription)
      .then(() => {
        console.log('로컬 설명이 설정되었습니다:', sessionDescription); // 로컬 설명이 성공적으로 설정되었음을 출력합니다.
      })
      .catch(error => {
        console.error('로컬 설명 설정 오류:', error); // 로컬 설명 설정 오류를 출력합니다.
      });
  };

  const onRemoteDescriptionSet = (key: string) => {
    const pendingCandidates = pendingCandidatesMap.get(key);
    if (pendingCandidates) {
      const pc = pcListMap.get(key);
      if (pc) {
        pendingCandidates.forEach(candidate => {
          pc.addIceCandidate(candidate).catch(error => {
            console.error('ICE 후보자 추가 오류:', error);
          });
        });
      }
      pendingCandidatesMap.delete(key);
    }
  };

  const connectSocket = async () => {
    const socket = new SockJS('https://mamdaero.o-r.kr/api/signaling');
    // const socket = new SockJS('http://localhost:8080/signaling');
    stompClient.webSocketFactory = () => socket;
    // stompClient.debug = str => {
    //   console.log(`STOMP 디버그: ${str}`);
    // };
    stompClient.onConnect = frame => {
      console.log('STOMP 연결 성공:', frame);

      stompClient.subscribe(`/sub/peer/iceCandidate/${memberId}/${reservationId}`, candidate => {
        console.log('받은 ICE 후보자:', candidate); // 받은 ICE 후보자를 출력합니다.
        const key = JSON.parse(candidate.body).key;
        const message = JSON.parse(candidate.body).body;
        const pc = pcListMap.get(key);
        const iceCandidate = new RTCIceCandidate({
          candidate: message.candidate,
          sdpMLineIndex: message.sdpMLineIndex,
          sdpMid: message.sdpMid,
        });

        if (pc) {
          if (pc.remoteDescription) {
            pc.addIceCandidate(iceCandidate).catch(error => {
              console.error('ICE 후보자 추가 오류:', error);
              console.log('후보자:', message);
            });
          } else {
            console.log(
              `키 ${key}에 대한 원격 설명이 설정되지 않았습니다. 후보자를 대기열에 추가합니다.`
            );
            if (!pendingCandidatesMap.has(key)) {
              pendingCandidatesMap.set(key, []);
            }
            pendingCandidatesMap.get(key)!.push(iceCandidate);
          }
        } else {
          console.warn(`키 ${key}에 대한 PeerConnection을 찾을 수 없습니다.`); // PeerConnection이 없는 경우 경고를 출력합니다.
        }
      });

      stompClient.subscribe(`/sub/peer/offer/${memberId}/${reservationId}`, offer => {
        console.log('받은 offer:', offer); // 받은 offer를 출력합니다.
        const key = JSON.parse(offer.body).key;
        const message = JSON.parse(offer.body).body;
        const pc = createPeerConnection(key);

        pcListMap.set(key, createPeerConnection(key));
        pc.setRemoteDescription(
          new RTCSessionDescription({
            type: message.type,
            sdp: message.sdp,
          })
        )
          .then(() => {
            console.log('offer에 대한 원격 설명이 설정되었습니다'); // 원격 설명이 성공적으로 설정되었음을 출력합니다.
            onRemoteDescriptionSet(key); // 원격 설명 설정 후 대기 중인 ICE 후보자 처리
            sendAnswer(pc, key);
          })
          .catch(error => {
            console.error('offer에 대한 원격 설명 설정 오류:', error); // 원격 설명 설정 오류를 출력합니다.
          });
      });

      stompClient.subscribe(`/sub/peer/answer/${memberId}/${reservationId}`, answer => {
        console.log('받은 answer:', answer); // 받은 answer를 출력합니다.
        const key = JSON.parse(answer.body).key;
        const message = JSON.parse(answer.body).body;
        const pc = pcListMap.get(key);
        if (!pc) return;
        pc.setRemoteDescription(new RTCSessionDescription(message))
          .then(() => {
            console.log('answer에 대한 원격 설명이 설정되었습니다'); // answer에 대한 원격 설명이 성공적으로 설정되었음을 출력합니다.
            onRemoteDescriptionSet(key); // 원격 설명 설정 후 대기 중인 ICE 후보자 처리
          })
          .catch(error => {
            console.error('answer에 대한 원격 설명 설정 오류:', error); // answer에 대한 원격 설명 설정 오류를 출력합니다.
          });
      });

      stompClient.subscribe('/sub/call/key', message => {
        console.log('키에 대한 호출을 받았습니다:', message); // 키에 대한 호출을 받았을 때 로그를 출력합니다.
        stompClient.publish({
          destination: '/sub/send/key',
          body: JSON.stringify(memberId),
        });
      });

      stompClient.subscribe('/sub/send/key', message => {
        console.log('받은 상대 키:', message); // 받은 상대방의 키를 출력합니다.
        const key = JSON.parse(message.body);
        if (memberId !== key && otherKeyList.indexOf(key) === -1) {
          console.log(`상대 키 ${key}를 목록에 추가합니다`);
          otherKeyList.push(key);
        }
      });
    };

    // 연결시도
    stompClient.activate();
  };

  const streaming = async () => {
    if (!stompClient) return;
    console.log('스트림 버튼 클릭. 서버에 call/key 신호를 전송합니다...');
    await stompClient.publish({ destination: '/sub/call/key' });

    // 키 교환이 완료된 후에만 offer를 전송
    setTimeout(() => {
      if (otherKeyList.length > 0) {
        console.log(otherKeyList);
        otherKeyList.forEach(key => {
          console.log(`PeerConnection 생성 및 상대방 ${key}에게 offer 전송`);
          pcListMap.set(key, createPeerConnection(key));
          sendOffer(pcListMap.get(key)!, key);
        });
      } else {
        console.warn('연결할 피어가 없습니다.'); // 연결할 피어가 없는 경우 경고를 출력합니다.
      }
    }, 2000); // 2초 대기 후 offer 전송
  };

  useEffect(() => {
    const init = async () => {
      await connectMedia();
      await connectSocket();
    };

    init();
    return () => {
      disconnectMedia();
    };
  }, []);

  useEffect(() => {
    if (!localStream || !localVideoRef.current) return;
    localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  return (
    <div className="flex flex-col min-h-screen justify-start">
      <MyCounselBar
        title1="맘대로"
        title2="화상채팅"
        subtitle=""
        user="client"
        buttonLabel="메인화면 돌아가기"
        buttonPath="/"
      />
      <div className="bg-white h-[80vh] flex p-6 mr-12 ml-12 mb-12 space-x-4 rounded-lg">
        <div className="w-2/3 flex flex-col h-full">
          <div className=" bg-gray-100 h-[95%] rounded-lg p-4 shadow-md relative">
            {remoteStreams.size === 0 ? (
              <div className="w-full h-full  rounded-lg bg-gray-300 flex items-center justify-center">
                <p>상담사 기다리는 중...</p>
              </div>
            ) : (
              [...remoteStreams.entries()].map(([key, stream]) => (
                <VideoComponent key={key} stream={stream} />
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
              <span>{isCameraOn ? '비디오 켜짐' : '비디오 꺼짐'}</span>
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs ${
                isMicOn ? 'bg-orange-400 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              <FaMicrophone className="mr-1.5 text-sm" />
              <span>{isMicOn ? '마이크 켜짐' : '마이크 꺼짐'}</span>
            </button>
            <button
              onClick={streaming}
              className="flex items-center px-3 py-1.5 rounded-lg text-xs bg-gray-300  text-gray-700"
            >
              <FaSyncAlt className="mr-1.5 text-sm" />
              <span>연결</span>
            </button>
          </div>
        </div>
        <div className="w-1/3 h-full flex flex-col">
          <div className="h-[30vh] mb-4 bg-gray-100 rounded-lg shadow-md relative overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <div className=" h-[55vh] bg-gray-100 rounded-lg mb-11 shadow-md flex flex-col overflow-auto">
            <div className="pl-4 pt-2 border-b">
              <h2 className="text-base font-semibold">대화창</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-1 flex flex-col-reverse">
              {chatLog.map(({ data, sender, time }, index) => {
                return (
                  <div
                    key={index}
                    className={`chat ${sender === memberId ? 'chat-end' : 'chat-start'} w-full mb-2`}
                  >
                    <div className="chat-header text-xs">
                      <time className="text-xs opacity-50 ml-1">{time}</time>
                    </div>
                    <div className="chat-bubble chat-bubble-primary break-words text-sm max-w-[80%]">
                      {data}
                    </div>
                  </div>
                );
              })}
            </div>
            <form className="p-2 border-t flex" onSubmit={sendMessage}>
              <input
                name="messageInput"
                type="text"
                placeholder="메시지를 입력하세요."
                className="flex-grow px-2 py-1 border rounded-lg mr-2 text-sm"
                autoComplete="off"
              />
              <Button label="전송" type="submit" size="검색" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VideoProps {
  stream: MediaStream;
}
const VideoComponent: React.FC<VideoProps> = memo(({ stream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full rounded-lg bg-gray-300 object-cover"
      />
    </div>
  );
});
VideoComponent.displayName = 'VideoComponent';
