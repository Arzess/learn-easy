import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {fonts, colors} from '@/constants/theme'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import Input from '@/components/Input';
import { useDB } from '../../db/DatabaseContext';
import Button from '@/components/Button';


export default function Introduction() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const db = useDB();
  
  const checkForm = () => {
    return false;
  }

  return (
      
      <ThemedView>
        <View>
          <Text style={[fonts.josefin, fonts.josefinMedium]} className="heading">Hallo!</Text>
          <Text style={fonts.josefin}>Bitte erzähl uns kurz über dich.</Text>
        </View>
        
        <View style={styles.form}>
          
          <Input color='dark' placeholder='Username' label="Username"/>
          <Input color='dark' placeholder='Vorname' label="Vorname"/>

          <Button text="Weiter" iconName="chevron-right" onPress={()=>{
            checkForm();
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
  },
  form: {
    backgroundColor: colors.whiteBg.backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }


});