import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Card from '@/components/Card';
import NothingFound from '@/components/NothingFound';

export default function Bookmarks() {
  const router = useRouter();
  const [boomarks, setBookmarks] = useState([]);


  return (
      <ThemedView style={styles.container}>
        <View style={styles.titleNavigationContainer}>
            <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
            <View style={styles.titleContainer}>
                <Text style={[fonts.josefin, colors.white]}>Bookmarks</Text>
                <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, colors.white]} className="heading">Videos</Text>
            </View>
        </View>
        {/* Bookmarks */}
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },
  container: {
    flex: 1,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  categories: {
    display: 'flex',
    gap: 16,
  },
  titleNavigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  }
});