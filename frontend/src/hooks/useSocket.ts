import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  url?: string;
  events?: string[];
  onMessage?: (event: string, data: unknown) => void;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  lastMessage: { event: string; data: unknown } | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data: unknown) => void;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const {
    url = 'http://localhost:3001',
    events = [],
    onMessage,
    autoConnect = true,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<{ event: string; data: unknown } | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    events.forEach((event) => {
      socketRef.current?.on(event, (data) => {
        setLastMessage({ event, data });
        onMessage?.(event, data);
      });
    });
  }, [url, events, onMessage]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    connect,
    disconnect,
    emit,
  };
}
