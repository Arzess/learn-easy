// mit KI bearbeitet – neue Toast-Komponente für "Saved to Library" / "Removed from Library" Benachrichtigungen
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { fonts } from '@/constants/theme';

// Zeigt eine kurze Benachrichtigung am unteren Bildschirmrand an.
// Wird mit "visible" gesteuert: bei true blendet es ein (200ms), wartet 1,6s, blendet aus (300ms).
// Wird z.B. nach Bookmark-Aktionen verwendet ("Saved to Library").
// Props: message = anzuzeigender Text, visible = sichtbar/unsichtbar
export default function Toast({ message, visible }: { message: string; visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
      <Text style={[fonts.josefin, styles.text]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});
