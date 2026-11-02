import React, { createContext, useContext } from 'react';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext<ReturnType<typeof useOutboxSync> | null>(
  null,
);
export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useOutboxSync();
  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
export const useSync = () => {
  const value = useContext(SyncContext);
  if (!value) {
    throw new Error('useSync phải nằm trong SyncProvider.');
  }
  return value;
};
