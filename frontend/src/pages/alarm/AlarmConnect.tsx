import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import toast, { Toaster } from 'react-hot-toast';
import AlarmToast from './BoardAlarmToast.tsx';
import ReservationAlarmToast from './ReservationAlarmToast.tsx';

const AlarmConnect = () => {
  const storedData = localStorage.getItem('auth-storage');
  const parsedData = storedData ? JSON.parse(storedData) : null;
  const accessToken = parsedData ? parsedData.state.accessToken : null;
  const queryClient = useQueryClient();

  // console.log(storedData);
  // console.log(storedData);
  // console.log(accessToken);

  useEffect(() => {
    // const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSourcePolyfill(
      'https://mamdaero.o-r.kr/api/cm/notification/connect',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Connection': 'keep-alive',
          'Accept': 'text/event-stream',
          'X-Accel-Buffering': 'no',
        },
        withCredentials: true,
      }
    );

    eventSource.onopen = () => {
      console.log('Connection opened');
    };

    eventSource.addEventListener('connect', (event: any) => {
      console.log('SSE CONNECTED');
      console.log('Event Data:', event.data);
    });

    eventSource.addEventListener('comment', (event: any) => {
      const comment = JSON.parse(event.data);
      toast.custom(t => <AlarmToast t={t} comment={comment} />);
    });

    eventSource.addEventListener('reservation', (event: any) => {
      const reservation = JSON.parse(event.data);
      toast.custom(t => <ReservationAlarmToast t={t} comment={reservation} />);
    });

    eventSource.onerror = (error: any) => {
      console.error('SSE Error:', error);
    };

    return () => {
      <div>
        <Toaster />
      </div>;
      eventSource.close();
    };
  }, [accessToken, queryClient]);

  return null;
};

export default AlarmConnect;
