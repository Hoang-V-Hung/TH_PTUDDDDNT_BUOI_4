import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { EntityId } from './models';

export type StudyStackParamList = {
  Home: undefined;
  CourseList: undefined;
  CourseDetail: { id: EntityId };
  Schedule: undefined;
  SessionDetail: { id: EntityId };
  AssignmentList: undefined;
  AssignmentDetail: { id: EntityId };
  AssignmentForm: undefined;
  Profile: undefined;
  EditProfile: undefined;
  GradeList: undefined;
  GradeDetail: { id: EntityId };
};
export type StudyTabParamList = {
  HomeTab: undefined;
  CourseTab: undefined;
  ScheduleTab: undefined;
  AssignmentTab: undefined;
  ProfileTab: undefined;
};
export type ScreenProps<T extends keyof StudyStackParamList> =
  NativeStackScreenProps<StudyStackParamList, T>;
