import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import spacing from '../theme/spacing';

export default function useCardGrid() {
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const columns = width < 350 || fontScale > 1.3 ? 1 : width >= 700 ? 3 : 2;
  return {
    columns,
    cardWidth:
      (width -
        insets.left -
        insets.right -
        spacing.lg * 2 -
        spacing.md * (columns - 1)) /
      columns,
  };
}
