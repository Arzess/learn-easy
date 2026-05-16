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
  const [role, setRole] = useState("");
  const {name, username} = useLocalSearchParams();
  const next_step = (name: string, username: string, role: string) => {
        router.push({
          pathname: "/start/Intensity",
          params: { 
            name: name,
            username: username,
            role: role,
          }
        });
  }

  const press = (selectedRole: string) => {
    setRole(prevRole => prevRole === selectedRole ? "" : selectedRole);
  }

  return (
      
      <ThemedView style={styles.container}>
          <View style={styles.contentContainer}>
            <View>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading]} className="heading">Whats your role?</Text>
            <Text style={[fonts.josefin, styles.subheading]}>Choose your role.</Text>
          </View>

          <View style={styles.cards}>
              <Card subtext="I am a" text="Student" selected={role === "student"} onPress={()=>{press("student")}}/>
              <Card subtext="I am a" text="Teacher" selected={role === "teacher"} onPress={()=>{press("teacher")}}/>
              <Card subtext="I am" text="just looking for new things to learn" selected={role === "learner"} onPress={()=>{press("learner")}}/>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button text="Next" iconName="chevron-right" light={true} darkIcon={true} fullWidth={true} onPress={()=>{
            if (role != "") next_step(name as any, username as any, role)
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