import type { TextStyle } from 'react-native';

const typography = {
  h1: { fontSize: 22, lineHeight: 30, fontWeight: '700' },
  h2: { fontSize: 18, lineHeight: 26, fontWeight: '700' },
  h3: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 14, lineHeight: 21 },
  input: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 12, lineHeight: 18 },
  small: { fontSize: 11, lineHeight: 16 },
  tab: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
  header: { fontSize: 17, lineHeight: 24, fontWeight: '700' },
  metric: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
} satisfies Record<string, TextStyle>;
export default typography;
