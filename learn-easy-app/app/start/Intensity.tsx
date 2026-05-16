import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {fonts, colors} from '@/constants/theme'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Card from '@/components/Card'

export default function Start() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const router = useRouter();
  const [intensity, setIntensity] = useState("");
  const {name, username, role} = useLocalSearchParams();
  const next_step = (name: string, username: string, role: string, intensity: string) => {
        router.push({
          pathname: "/start/Kurswahl",
          params: { 
            name: name,
            username: username,
            role: role,
            intensity: intensity,
          }
        });
  }

  const press = (selectedIntensity: string) => {
    setIntensity(prevIntensity => prevIntensity === selectedIntensity ? "" : selectedIntensity);
  }

  return (
      
      <ThemedView style={styles.container}>
          <View style={styles.contentContainer}>
            <View>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading]} className="heading">How often do you want to learn?</Text>
            <Text style={[fonts.josefin, styles.subheading]}>Choose your learning intensity.</Text>
          </View>

          <View style={styles.cards}>
              <Card subtext="Easy" text="1 lesson a day" selected={intensity === "easy"} onPress={()=>{press("easy")}}/>
              <Card subtext="Medium" text="3 lesson a day" selected={intensity === "medium"} onPress={()=>{press("medium")}}/>
              <Card subtext="Hard" text="5 lesson a day" selected={intensity === "hard"} onPress={()=>{press("hard")}}/>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button text="Next" iconName="chevron-right" light={true} darkIcon={true} fullWidth={true} onPress={()=>{
            if (intensity != "") next_step(name as any, username as any, role as any, intensity as any)
          }}/>
        </View>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    color: 'white',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: "wrap",
    gap: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 24,
  },
  subheading: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    gap: 24,
    padding: 16,
  },
  buttonContainer: {
    height: 48,
  },
});