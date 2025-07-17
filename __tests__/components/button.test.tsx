/**
 * Unit tests for Button component
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../../components/ui/button';

// Mock theme provider
jest.mock('../../components/shared/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      text: '#000000',
      surface: '#F2F2F7',
      error: '#FF3B30',
      warning: '#FF9500',
      success: '#34C759',
    },
  }),
}));

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Test Button</Button>);
    
    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('should handle onPress events', () => {
    const onPressMock = jest.fn();
    render(<Button onPress={onPressMock}>Press Me</Button>);
    
    fireEvent.press(screen.getByText('Press Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toBeTruthy();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toBeTruthy();

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toBeTruthy();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toBeTruthy();
  });

  it('should show loading state', () => {
    render(<Button loading>Loading Button</Button>);
    
    // Should show loading indicator
    expect(screen.getByTestId('button-loading-indicator')).toBeTruthy();
  });

  it('should be disabled when loading', () => {
    const onPressMock = jest.fn();
    render(<Button loading onPress={onPressMock}>Loading Button</Button>);
    
    fireEvent.press(screen.getByTestId('button-touchable'));
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    render(<Button disabled onPress={onPressMock}>Disabled Button</Button>);
    
    fireEvent.press(screen.getByTestId('button-touchable'));
    
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render with icon', () => {
    const IconComponent = () => <></>;
    render(<Button icon={IconComponent}>Button with Icon</Button>);
    
    expect(screen.getByText('Button with Icon')).toBeTruthy();
  });

  it('should handle full width', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    expect(screen.getByText('Full Width Button')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Button style={customStyle}>Custom Style</Button>);
    
    expect(screen.getByText('Custom Style')).toBeTruthy();
  });

  it('should have proper accessibility props', () => {
    render(
      <Button 
        accessibilityLabel="Custom accessibility label"
        accessibilityHint="Custom accessibility hint"
      >
        Accessible Button
      </Button>
    );
    
    const button = screen.getByTestId('button-touchable');
    expect(button.props.accessibilityLabel).toBe('Custom accessibility label');
    expect(button.props.accessibilityHint).toBe('Custom accessibility hint');
  });

  it('should have default accessibility role', () => {
    render(<Button>Button</Button>);
    
    const button = screen.getByTestId('button-touchable');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('should handle press events with haptic feedback', () => {
    const onPressMock = jest.fn();
    render(<Button onPress={onPressMock}>Haptic Button</Button>);
    
    fireEvent.press(screen.getByTestId('button-touchable'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

