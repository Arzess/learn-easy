import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {fonts, colors} from '@/constants/theme'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

export default function Start() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

   const next_step = (name: string, username: string) => {
        router.push({
          pathname: "/start/Rolle",
          params: { 
            name: name,
            username: username,
          }
        });
  }

  return (
      
      <ThemedView style={styles.container}>
        <View>
          <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading]} className="heading">Hey!</Text>
          <Text style={[fonts.josefin, styles.subheading]}>Could you tell us about yourself?</Text>
        </View>
        
        <View style={styles.form}>
          
          <Input color='dark' placeholder='' value={username} label="Username" changeText={setUsername}/>
          <Input color='dark' placeholder='' value={name} label="Name" changeText={setName}/>

          <Button text="Next" iconName="chevron-right" darkIcon={false} onPress={()=>{
            if (name != "" && username != "") next_step(name, username)
          }}/>
          <View>
          </View>
        </View>
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    color: 'white',
  },
  form: {
    backgroundColor: colors.whiteBg.backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 16,
  },
  subheading: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    gap: 24,
    padding: 16,
  }


});