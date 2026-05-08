
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, StyleSheet } from 'react-native'
import { DatabaseProvider } from './DatabaseContext';
import Start from './(tabs)/Start';
import { useFonts } from "expo-font";
import { JosefinSans_400Regular, JosefinSans_500Medium, JosefinSans_600SemiBold, JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans";
import { useDB } from './DatabaseContext';
import HomeScreen from './(tabs)/Main'

const completeIntro = async () => {
  await AsyncStorage.setItem('@firstLaunch', 'false');
};


const isItTheFirstTime = async () => {
  const isFirstLaunch = await AsyncStorage.getItem('@firstLaunch');
  return (isFirstLaunch == null);
}


export default function App() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular, JosefinSans_500Medium, JosefinSans_600SemiBold, JosefinSans_700Bold
  });
  if (!fontsLoaded) {
    return null;
  }
  completeIntro();
  return (
    <DatabaseProvider>
      {/* If it's the first time opening the app or the intro hasn't been finished yet */}
      {
        // @ts-ignore
        isItTheFirstTime() &&
        <>
          <Start/>
        </>
      }
      {/* If it's not the first time show the main page */}
      {
        // @ts-ignore
        !isItTheFirstTime() && 
        <>
          <HomeScreen/>
        </>
      }
      <Start />
    </DatabaseProvider>
  );
}



export const colors = StyleSheet.create({
  black: {
    color: '#000000'
  },  
  blackBg: {
    backgroundColor: '#000000'
  },
  primary: {
    color: '#505050'
  },
  primaryBg: {
    backgroundColor: '#505050',
  },
  white: {
    color: 'white',
  },
  whiteBg: {
    backgroundColor: 'white',
  },
  interface: {
    color: '#1B1E20',
  },
  interfaceBg: {
    backgroundColor: '#1B1E20',
  },
  primary2: {
    color: '#B4B4B4',
  },
  primary2Bg: {
    backgroundColor: '#B4B4B4',
  },
  secondary: {
    color: '#E8E8E8',
  },
  secondaryBg: {
    backgroundColor: '#E8E8E8',
  },
  secondary2: {
    color: '#E5E5E5',
  },
  secondary2Bg: {
    backgroundColor: '#E5E5E5',
  },
  interface2: {
    color: '#171717',
  },
  interface2Bg: {
    backgroundColor: '#171717'
  }

})

export const fonts = StyleSheet.create({
    josefin: {
      fontFamily: 'JosefinSans_400Regular',
    },
    josefinMedium: {
      fontFamily: 'JosefinSans_500Medium',

    },
    josefinSemi: {
      fontFamily: 'JosefinSans_600SemiBold'
    },
    josefinBold: {
      fontFamily: 'JosefinSans_700Bold',
    },

})