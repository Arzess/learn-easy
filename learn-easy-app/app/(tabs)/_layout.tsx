import { Tabs } from 'expo-router';
import React from 'react';
import SVG from '../../components/svg'
import '../../components/svg-sheet'
import { colors } from '@/constants/theme';
import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/context/theme-context';

// mit KI bearbeitet – Tab-Labels hinzugefügt (Home, Search, Library, Account)
export default function TabLayout() {
  const { isDarkMode } = useAppTheme();

  const tabBarBg = isDarkMode ? '#1B1E20' : '#ffffff';
  const tabBarBorder = isDarkMode ? colors.white.color : '#f0f0f0';
  const tabBarActiveBg = isDarkMode ? '#ffffff' : '#f0f0f0';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: tabBarActiveBg,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 8,
          fontFamily: 'JosefinSans_400Regular',
        },
        tabBarActiveTintColor: isDarkMode ? '#000' : '#000',
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#888',
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
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <SVG icon={"home"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Suche"
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => <SVG icon={"library"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Bookmarks"
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({ focused }) => <SVG icon={"bookmark"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => <SVG icon={"user"} width={24} height={24} white={isDarkMode && !focused}/>,
        }}
      />
    </Tabs>
  );
}
