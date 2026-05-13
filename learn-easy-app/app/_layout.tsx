import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { DatabaseProvider } from '../db/DatabaseContext';
import { ThemeContextProvider } from '@/context/theme-context';
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold, JosefinSans_600SemiBold, JosefinSans_500Medium } from "@expo-google-fonts/josefin-sans";
import AsyncStorage from '@react-native-async-storage/async-storage';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded] = useFonts({ JosefinSans_400Regular, JosefinSans_700Bold, JosefinSans_600SemiBold, JosefinSans_500Medium });

  useEffect(() => {
    async function prepare() {
      try {
        const firstLaunch = await AsyncStorage.getItem('@firstLaunch');
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  return (
    <ThemeContextProvider>
      <DatabaseProvider>
         <Stack screenOptions={{ headerShown: false }} />
      </DatabaseProvider>
    </ThemeContextProvider>
  );
}