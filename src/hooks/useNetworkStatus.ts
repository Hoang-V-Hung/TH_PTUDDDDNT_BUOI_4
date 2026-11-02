import { useNetInfo } from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const state = useNetInfo();
  return {
    isOnline:
      state.isConnected !== false && state.isInternetReachable !== false,
  };
}
