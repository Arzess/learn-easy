import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Start</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 80,
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