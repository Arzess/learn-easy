import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {fonts} from '@/constants/theme'

export default function Introduction() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  
  return (
      
      <ThemedView>
        <View>
          <Text style={[fonts.josefin, fonts.josefinMedium]} className="heading">Willkommen zurück!</Text>
        </View>
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },

});