import { StyleSheet } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Lernen</ThemedText>
        <HelloWave />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 80,
    marginRight: 150,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});