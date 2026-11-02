import { Platform } from 'react-native';

// Android qua ADB (máy ảo hoặc điện thoại): adb reverse tcp:3000 tcp:3000.
// Máy ảo không dùng reverse: http://10.0.2.2:3000.
// Điện thoại không kết nối ADB: đổi thành http://<IP-LAN-máy-tính>:3000.
export const BASE_URL =
  Platform.OS === 'android' ? 'http://127.0.0.1:3000' : 'http://localhost:3000';
export const TIMEOUT = 10000;
// Cache không bị xóa khi hết TTL: dữ liệu cũ vẫn dùng được lúc offline.
export const CACHE_TTL = 5 * 60 * 1000;
