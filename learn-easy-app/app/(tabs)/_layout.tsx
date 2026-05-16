import { Tabs } from 'expo-router';
import React from 'react';
import SVG from '../../components/svg'
import '../../components/svg-sheet'
import { HapticTab } from '@/components/haptic-tab';
import { colors } from '@/constants/theme';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: "white",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#1B1E20',
          borderTopWidth: 2,
          borderTopColor: colors.white.color,
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
          padding: 20,
        }
    }}>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"home"} width={24} height={24} white={!focused}/>,
        }}
      />

      <Tabs.Screen
        name="Suche"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"library"} width={24} height={24} white={!focused}/>,
        }}
      />

      <Tabs.Screen
        name="Bookmarks"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"bookmark"} width={24} height={24} white={!focused}/>,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          tabBarIcon: ({ focused }) => <SVG icon={"user"} width={24} height={24} white={!focused}/>,
        }}
      />
    </Tabs>
  );
}
