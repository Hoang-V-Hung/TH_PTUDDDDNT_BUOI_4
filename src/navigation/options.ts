import colors from '../theme/colors';
import typography from '../theme/typography';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createElement } from 'react';
import BrandHeader from '../components/common/BrandHeader';

export const stackOptions: NativeStackNavigationOptions = {
  header: ({ navigation, options, route, back }) =>
    createElement(BrandHeader, {
      title: options.title || route.name,
      onBack: back ? () => navigation.goBack() : undefined,
    }),
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.primary },
  headerTitleStyle: typography.h3,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: { backgroundColor: colors.background },
};
