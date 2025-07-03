import React from 'react';
import { ScrollView } from 'react-native';
import { getColors, useTheme } from '../lib/theme/theme';
import { Container } from './ui/Container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ResponsiveLayoutProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  debug?: boolean;
};

export default function ResponsiveLayout({
  children,
  scrollable = true,
  debug = false,
}: ResponsiveLayoutProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getColors(theme);

  return scrollable ? (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Container style={debug ? { borderWidth: 1, borderColor: 'red' } : undefined}>
        {children}
      </Container>
    </ScrollView>
  ) : (
    <Container
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
        ...(debug ? { borderWidth: 1, borderColor: 'red' } : {}),
      }}
    >
      {children}
    </Container>
  );
}