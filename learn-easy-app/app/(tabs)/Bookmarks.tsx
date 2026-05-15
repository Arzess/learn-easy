import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';

export default function Bookmarks() {
  const router = useRouter();
  
  return (
      <ThemedView style={styles.container}>
         <View style={styles.titleContainer}>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, colors.white]} className="heading">Bookmarks</Text>
            <Text style={[fonts.josefin, colors.white]}>Browse through your saved content</Text>
          </View>

          <View style={styles.categories}>
            <Card subtext="Category" text="Pictures" onPress={()=>{
              router.navigate("/bookmarks/Pictures")
            }}/>
            <Card subtext="Category" text="Videos" onPress={()=>{
              router.navigate("/bookmarks/Videos")
            }}/>
            <Card subtext="Category" text="Texts" onPress={()=>{
              router.navigate("/bookmarks/Texts")
            }}/>
          </View>
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
  }
});