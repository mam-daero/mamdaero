/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWebRTCStore } from '@/stores/webRTCStore';
import { Client } from '@stomp/stompjs';
import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
const myKey = Math.random().toString(36).substr(2, 11);
const roomId = '2';
export const FaceChat2: React.FC = () => {
  // TODO: reservationId, memberId 가져오기
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const [stompClient, setStompClient] = React.useState<Client>(new Client());
  const [otherKeyList, setOtherKeyList] = React.useState<string[]>([]);
  const [pcListMap, setPcListMap] = React.useState<Map<string, RTCPeerConnection>>(new Map());
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = React.useState<Map<string, MediaStream>>(new Map());
  const [isCameraOn, setIsCameraOn] = React.useState(false);
  const [isMicOn, setIsMicOn] = React.useState(false);

  const pendingCandidatesMap = new Map<string, RTCIceCandidateInit[]>();

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

      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

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
        key: myKey,
        body: event.candidate,
      };

      console.log(`상대방 ${otherKey}에게 전송할 ICE 후보자 메시지:`, candidateMessage);
      stompClient.publish({
        destination: `/sub/peer/iceCandidate/${otherKey}/${roomId}`,
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
          key: myKey,
          body: offer,
        };

        console.log(`상대방 ${otherKey}에게 전송할 Offer 메시지:`, offerMessage);
        stompClient.publish({
          destination: `/sub/peer/offer/${otherKey}/${roomId}`,
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
          key: myKey,
          body: answer,
        };

        console.log(`상대방 ${otherKey}에게 전송할 Answer 메시지:`, answerMessage);
        stompClient.publish({
          destination: `/sub/peer/answer/${otherKey}/${roomId}`,
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

      stompClient.subscribe(`/sub/peer/iceCandidate/${myKey}/${roomId}`, candidate => {
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

      stompClient.subscribe(`/sub/peer/offer/${myKey}/${roomId}`, offer => {
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

      stompClient.subscribe(`/sub/peer/answer/${myKey}/${roomId}`, answer => {
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
          body: JSON.stringify(myKey),
        });
      });

      stompClient.subscribe('/sub/send/key', message => {
        console.log('받은 상대 키:', message); // 받은 상대방의 키를 출력합니다.
        const key = JSON.parse(message.body);
        if (myKey !== key && otherKeyList.indexOf(key) === -1) {
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
    <div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full rounded-lg bg-gray-300"
        style={{ transform: 'rotateY(180deg)' }}
      ></video>
      {[...remoteStreams.entries()].map(([key, stream]) => (
        <div key={key}>
          <video
            ref={el => {
              if (el) {
                el.srcObject = stream;
              }
            }}
            autoPlay
            playsInline
            className="w-full h-full rounded-lg bg-gray-200"
            style={{ transform: 'rotateY(180deg)' }}
          ></video>
        </div>
      ))}
      <div id="list"></div>
      <button className="btn btn-lg btn-primary" onClick={streaming}>
        gogossing
      </button>
      <button onClick={toggleCamera}>{isCameraOn ? 'CAMERA ON' : 'CAMERA OFF'}</button>
      <button onClick={toggleMic}>{isMicOn ? 'MIC ON' : 'MIC OFF'}</button>
    </div>
  );
};
