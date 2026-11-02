import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { AppState } from 'react-native';
import useNetworkStatus from './useNetworkStatus';
import { getAll, subscribe, getSnapshot } from '../storage/outbox';
import { flushOutbox } from './syncEngine';
import { errorMessage } from '../utils/errors';

export default function useOutboxSync() {
  const { isOnline } = useNetworkStatus();
  const online = useRef(isOnline);
  online.current = isOnline;
  const actions = useSyncExternalStore(subscribe, getSnapshot);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState({ message: '', error: false });
  const notify = useCallback(
    (message: string, error = false) => setNotice({ message, error }),
    [],
  );
  const syncNow = useCallback(async () => {
    if (!online.current) {
      return;
    }
    setSyncing(true);
    try {
      const result = await flushOutbox(() => online.current, notify);
      setReady(true);
      return result;
    } catch (error) {
      notify(errorMessage(error, 'Không đọc được hàng đợi đồng bộ.'), true);
    } finally {
      setSyncing(false);
    }
  }, [notify]);
  useEffect(() => {
    getAll()
      .then(() => setReady(true))
      .catch(error =>
        notify(error.message || 'Không đọc được hàng đợi đã lưu.', true),
      );
  }, [notify]);
  useEffect(() => {
    if (ready && isOnline) {
      syncNow();
    }
  }, [ready, isOnline, actions.length, syncNow]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (getSnapshot().length) {
        syncNow();
      }
    }, 15000);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        syncNow();
      }
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [syncNow]);
  return {
    isOnline,
    actions,
    ready,
    pendingCount: actions.length,
    syncing,
    syncNow,
    notice,
    notify,
  };
}
