import { Redirect, useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';



export const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  return AsyncStorage.getItem(key);
};


export const completeIntro = async () => {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  await AsyncStorage.setItem('@firstLaunch', 'false');
};


export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const val = await getItem('@firstLaunch');
        setIsFirstLaunch(val !== 'false');
      } catch (e) {
        setIsFirstLaunch(false);
      }
    };
    checkStatus();
  }, []);

  if (isFirstLaunch === null || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return <Redirect href="/start/Start" />;
  }

  return <Redirect href="/(tabs)/Home" />;
}