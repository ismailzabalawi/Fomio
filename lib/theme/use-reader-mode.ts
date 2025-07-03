import { useTheme } from './theme';

export const useReaderMode = () => {
  const { theme } = useTheme();
  const isReaderMode = theme === 'reader';

  const readerModeStyles = {
    backgroundColor: '#F8F8F8',
    color: '#333333',
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  };

  return {
    isReaderMode,
    readerModeStyles: isReaderMode ? readerModeStyles : {},
  };
}; 