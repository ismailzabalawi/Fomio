import React, { createContext } from 'react';
import { SharedValue, useSharedValue, useAnimatedScrollHandler, withSpring } from 'react-native-reanimated';

export interface TabBarContextType {
  tabBarOffset: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
}

const TabBarContext = createContext<TabBarContextType>({
  tabBarOffset: { value: 0 } as SharedValue<number>,
  scrollHandler: () => {},
});

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const tabBarOffset = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // Provide a consistent scroll handler for all consumers
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - lastScrollY.value;

      tabBarOffset.value = withSpring(
        Math.min(Math.max(tabBarOffset.value - diff, -80), 0),
        { damping: 15, stiffness: 100 }
      );

      lastScrollY.value = currentScrollY;
    },
  });

  return (
    <TabBarContext.Provider value={{ tabBarOffset, scrollHandler }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = React.useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}

export { TabBarContext };