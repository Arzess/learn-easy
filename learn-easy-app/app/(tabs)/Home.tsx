import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {fonts} from '@/constants/theme'
import { useDB } from '@/db/DatabaseContext';

export default function Introduction() {
  const theme = useColorScheme();
  const db = useDB();
  const [userData, setUserData] = useState<any>(null);
  
  // Fetch the user data
  useEffect(()=>{
    const fetchUser = async () => {
      if (!db) return;

      // @ts-ignore
      const user = await db.general.user.findOne({
        selector: { current: {$eq: true}}
      }).exec();

      if (user) setUserData(user.toJSON())

    };

    fetchUser();

  }, [db]);


  const isDark = theme === 'dark';



  return (
      
      <ThemedView>
        <View>
          <Text style={[fonts.josefin, fonts.josefinMedium]} className="heading">Willkommen zurück, {userData.name}!</Text>
        </View>
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },

});