import { useState} from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import { useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {colors} from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getItem } from '../index';
import SVG from '@/components/svg'
import '@/components/svg-sheet'
import useFuzzySearchList from '@nozbe/microfuzz/dist/react/useFuzzySearchList';
// Course structure and content
import courses from '@/assets/courses.json'

const themen = courses.courses;
const COURSE_IMAGES: Record<string, any> = {
  "1": require('@/assets/images/themen/mongolisches-reich.png'),
  "2": require('@/assets/images/themen/frauen-technik.png'),
  "3": require('@/assets/images/themen/klimawandel.png'),
  "4": require('@/assets/images/themen/kuenstliche-intelligenz.png'),
  "5": require('@/assets/images/themen/raumfahrt.png'),
};


export default function SucheScreen() {
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const theme = useColorScheme();
  const {name, username, role, intensity} = useLocalSearchParams();
  const rootNavigationState = useRootNavigationState();

  const filtered = useFuzzySearchList({
    list: themen,
    queryText: query,
    getText: (item) => [item.course_name],
    mapResultItem: ({item}) => item,
  });

  if (!rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  const isDark = theme === 'dark';

  function toggleSave(id: string) {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const tint = '#0a7ea4';
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Suche</ThemedText>
      <ThemedText style={[styles.label, { color: Colors[theme].icon }]}>
        Schreibe die Inhalte die du suchst hier ein
      </ThemedText>
      
      {/* Suchleiste */}
      <View style={[styles.searchBar, {
        backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0',
        borderColor: isDark ? '#444' : '#ddd',
      }]}>
        <TextInput
          style={[styles.input, { color: Colors[theme].text }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Text hier"
          placeholderTextColor={Colors[theme].icon}
          returnKeyType="search"
        />
        <IconSymbol name="magnifyingglass" size={18} color={Colors[theme].icon} />
      </View>
      <ThemedText style={[styles.ergebnisse, { color: tint }]}>
        {filtered.length} Ergebnisse
      </ThemedText>
      
      {/* Karten */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filtered.map(thema => (
          <View key={thema.course_id} style={styles.kursBlock}>
            <View style={styles.titleContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.kursTitle, { color: tint }]}>
                {thema.course_name}
              </ThemedText>
            </View>
            <View style={[styles.card, { backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}>
              
              {COURSE_IMAGES[thema.course_id] ? (
                <Image 
                  source={COURSE_IMAGES[thema.course_id]} 
                  style={styles.cardImage} 
                  resizeMode="cover" 
                />
              ) : (
                <IconSymbol name="photo" size={40} color={Colors[theme].icon} />
              )}
              
              <TouchableOpacity
                style={[
                  styles.bookmark,
                  saved[thema.course_id]
                    ? { backgroundColor: tint, borderWidth: 0 }
                    : { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 2, borderColor: '#fff' },
                ]}
                onPress={() => toggleSave(thema.course_id)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="bookmark.fill"
                  size={16}
                  color={saved[thema.course_id] ? '#fff' : 'rgba(255,255,255,0.5)'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  ergebnisse: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  kursBlock: {
    marginBottom: 20,
  },
  kursTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  information: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    display: 'flex',
    flex: 1,
    minHeight: 32,
    backgroundColor: colors.whiteBg.backgroundColor,
  }
});
