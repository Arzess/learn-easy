// mit KI bearbeitet – neue Vollbild-Zoom Komponente für Bilder im Chapter-Content
import { Modal, StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { fonts } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// Zeigt ein Bild im Vollbildmodus in einem Modal an.
// Unterstützt Pinch-to-Zoom (max. 5x) und Doppeltipp zum Reinzoomen (2,5x) oder Zurücksetzen.
// Schließen über den ✕-Button oder den Hardware-Back-Button.
// Props: uri = Bild-URL, caption = optionaler Untertitel, visible = Modal-Sichtbarkeit, onClose = Callback
export default function ImageViewer({ uri, caption, visible, onClose }: {
  uri: string;
  caption?: string;
  visible: boolean;
  onClose: () => void;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const handleClose = () => {
    scale.value = 1;
    savedScale.value = 1;
    onClose();
  };

  const pinch = Gesture.Pinch()
    .onUpdate(e => { scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 5); })
    .onEnd(() => { savedScale.value = scale.value; });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else {
        scale.value = withSpring(2.5);
        savedScale.value = 2.5;
      }
    });

  const composed = Gesture.Simultaneous(pinch, doubleTap);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.imageWrapper, animStyle]}>
              <Image source={{ uri }} style={styles.image} contentFit="contain" />
            </Animated.View>
          </GestureDetector>

          {caption ? (
            <Text style={[fonts.josefin, styles.caption]}>{caption}</Text>
          ) : null}

          <Text style={[fonts.josefin, styles.hint]}>Pinch or double-tap to zoom</Text>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  imageWrapper: {
    width,
    height: height * 0.75,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    bottom: 48,
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  hint: {
    position: 'absolute',
    bottom: 24,
    color: '#555',
    fontSize: 11,
  },
});
