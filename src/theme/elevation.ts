import { StyleSheet } from 'react-native';
import colors from './colors';

// Bóng nhẹ của thẻ trắng theo ảnh Slink, dùng thống nhất trên các màn.
export default StyleSheet.create({
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
});
