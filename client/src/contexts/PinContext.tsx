import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../firebase/AuthContext';

type PinMode = 'setup' | 'verify';

interface PinState {
  hasPin: boolean;
  unlocked: boolean;
  expiresAt: number | null;
}

interface PinContextValue extends PinState {
  mode: PinMode;
  setMode: (mode: PinMode) => void;
  unlock: (pin: string) => Promise<boolean>;
  setup: (pin: string) => Promise<void>;
  lock: () => void;
}

const PinContext = createContext<PinContextValue | undefined>(undefined);

const TTL_MS = 10 * 60 * 1000;

function storageKey(userId: string) {
  return `pin_hash_v1:${userId}`;
}

function sessionKey(userId: string) {
  return `pin_session_v1:${userId}`;
}

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const PinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<PinMode>('verify');
  const [hasPin, setHasPin] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const lock = useCallback(() => {
    if (!user) return;
    try {
      sessionStorage.removeItem(sessionKey(user.uid));
    } catch {
    }
    setExpiresAt(null);
  }, [user]);

  const refreshFromStorage = useCallback(() => {
    if (!user) {
      setHasPin(false);
      setExpiresAt(null);
      return;
    }

    try {
      const pinHash = localStorage.getItem(storageKey(user.uid));
      setHasPin(!!pinHash);

      const sessionRaw = sessionStorage.getItem(sessionKey(user.uid));
      if (!sessionRaw) {
        setExpiresAt(null);
        return;
      }

      const session = JSON.parse(sessionRaw) as { expiresAt?: number };
      const exp = typeof session.expiresAt === 'number' ? session.expiresAt : null;
      if (!exp || exp <= Date.now()) {
        setExpiresAt(null);
        sessionStorage.removeItem(sessionKey(user.uid));
        return;
      }

      setExpiresAt(exp);
    } catch {
      setHasPin(false);
      setExpiresAt(null);
    }
  }, [user]);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    if (!expiresAt) return;
    const t = window.setInterval(() => {
      if (expiresAt <= Date.now()) {
        lock();
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [expiresAt, lock]);

  const setup = useCallback(
    async (pin: string) => {
      if (!user) return;
      const hash = await sha256(pin);
      localStorage.setItem(storageKey(user.uid), hash);
      setHasPin(true);
      const exp = Date.now() + TTL_MS;
      sessionStorage.setItem(sessionKey(user.uid), JSON.stringify({ expiresAt: exp }));
      setExpiresAt(exp);
    },
    [user]
  );

  const unlock = useCallback(
    async (pin: string): Promise<boolean> => {
      if (!user) return false;
      const stored = localStorage.getItem(storageKey(user.uid));
      if (!stored) return false;
      const hash = await sha256(pin);
      if (hash !== stored) return false;

      const exp = Date.now() + TTL_MS;
      sessionStorage.setItem(sessionKey(user.uid), JSON.stringify({ expiresAt: exp }));
      setExpiresAt(exp);
      return true;
    },
    [user]
  );

  const value = useMemo<PinContextValue>(
    () => ({
      mode,
      setMode,
      hasPin,
      unlocked: !!expiresAt && expiresAt > Date.now(),
      expiresAt,
      unlock,
      setup,
      lock,
    }),
    [mode, hasPin, expiresAt, unlock, setup, lock]
  );

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

export function usePin(): PinContextValue {
  const ctx = useContext(PinContext);
  if (!ctx) throw new Error('usePin must be used within PinProvider');
  return ctx;
}
