import { Tabs } from 'expo-router';
import React from 'react';
import SVG from '../../components/svg'
import '../../components/svg-sheet'
import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/context/theme-context';

export default function TabLayout() {
  const { isDarkMode } = useAppTheme();

  const tabBarBg = isDarkMode ? '#1B1E20' : '#ffffff';
  const tabBarBorder = isDarkMode ? 'rgba(255,255,255,0.15)' : '#e0e0e0';
  const tabBarActiveBg = isDarkMode ? '#ffffff' : '#f0f0f0';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: tabBarActiveBg,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: 1,
          borderTopColor: tabBarBorder,
          height: 128,
          paddingBottom: 32,
        },
        tabBarItemStyle: {
          marginHorizontal: 8,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          overflow: 'hidden',
        },
        tabBarIconStyle: {
          padding: 0,
          marginTop: 16,
        }
    }}>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"home"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Suche"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"library"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Bookmarks"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"bookmark"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"user"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />
    </Tabs>
  );
}
