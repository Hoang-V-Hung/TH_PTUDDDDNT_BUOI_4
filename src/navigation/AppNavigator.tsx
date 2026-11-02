import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { ROUTES } from './routes';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';
import type { StudyTabParamList } from '../types/navigation';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<StudyTabParamList>();
const icons = {
  [ROUTES.HOME_TAB]: 'home',
  [ROUTES.COURSE_TAB]: 'book',
  [ROUTES.SCHEDULE_TAB]: 'calendar',
  [ROUTES.ASSIGNMENT_TAB]: 'checkbox',
  [ROUTES.PROFILE_TAB]: 'person',
};
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};
function iconOptions(
  route: RouteProp<StudyTabParamList>,
): BottomTabNavigationOptions {
  return {
    tabBarIcon: ({ focused, color }) => (
      <Icon
        name={`${icons[route.name]}${focused ? '' : '-outline'}`}
        color={color}
        size={spacing.icon}
      />
    ),
  };
}
export default function AppNavigator() {
  const { assignments } = useAppData();
  const insets = useSafeAreaInsets();
  const count = assignments.filter(
    assignment => assignment.status !== 'done',
  ).length;
  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle="light-content" />
      <Tab.Navigator
        backBehavior="history"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.label,
          tabBarStyle: [
            styles.tabBar,
            {
              height: spacing.touch + spacing.xl + insets.bottom,
              paddingBottom: Math.max(insets.bottom, spacing.sm),
            },
          ],
          tabBarHideOnKeyboard: true,
          tabBarLabelPosition: 'below-icon',
          tabBarBadgeStyle: styles.badge,
          ...iconOptions(route),
        })}
      >
        <Tab.Screen
          name={ROUTES.HOME_TAB}
          component={HomeStack}
          options={{ title: 'Tổng quan' }}
        />
        <Tab.Screen
          name={ROUTES.COURSE_TAB}
          component={CourseStack}
          options={{ title: 'Môn học' }}
        />
        <Tab.Screen
          name={ROUTES.SCHEDULE_TAB}
          component={ScheduleStack}
          options={{ title: 'Lịch học' }}
        />
        <Tab.Screen
          name={ROUTES.ASSIGNMENT_TAB}
          component={AssignmentStack}
          options={{ title: 'Bài tập', tabBarBadge: count || undefined }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_TAB}
          component={ProfileStack}
          options={{ title: 'Cá nhân' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  label: { ...typography.tab },
  badge: {
    backgroundColor: colors.primary,
    color: colors.white,
    ...typography.small,
  },
  tabBar: {
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    elevation: spacing.none,
  },
});
