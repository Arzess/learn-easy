// mit KI bearbeitet – neuer Welcome-Screen nach Onboarding-Abschluss
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fonts } from '@/constants/theme';

export default function Welcome() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <Text style={[fonts.josefin, styles.greeting]}>Hey {name},</Text>
        <Text style={[fonts.josefinBold, styles.headline]}>Are you ready{'\n'}to learn?</Text>
        <Text style={[fonts.josefin, styles.sub]}>Your account is set up and{'\n'}your course is waiting for you.</Text>

        <TouchableOpacity style={styles.btn} onPress={() => router.navigate('/(tabs)/Home')} activeOpacity={0.85}>
          <Text style={[fonts.josefinBold, styles.btnText]}>Let's go →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  greeting: {
    color: '#aaa',
    fontSize: 20,
    marginBottom: 4,
  },
  headline: {
    color: '#fff',
    fontSize: 42,
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 12,
  },
  sub: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  btn: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 32,
  },
  btnText: {
    color: '#111',
    fontSize: 18,
  },
});
