declare module 'event-source-polyfill' {
  export class EventSourcePolyfill extends EventTarget {
    constructor(url: string, eventSourceInitDict?: EventSourceInit);
    readonly CLOSED: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
    readonly readyState: number;
    readonly url: string;
    close(): void;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
    onerror: (event: Event) => void;
    onmessage: (event: MessageEvent) => void;
    onopen: (event: Event) => void;
  }

  export interface EventSourceInit {
    withCredentials?: boolean;
    headers?: { [key: string]: string };
  }
}
