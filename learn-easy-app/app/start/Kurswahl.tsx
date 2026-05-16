import { useState, useEffect, useId,} from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, Touchable, Pressable } from 'react-native';
import { useLocalSearchParams, useRootNavigationState, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { completeIntro, getItem } from '../index';
import { useDB } from '@/db/DatabaseContext';
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

export default function Kurswahl() {
  const [query, setQuery] = useState('');
  const theme = useColorScheme();
  const userId = useId();
  const router = useRouter();
  const {name, username, role, intensity} = useLocalSearchParams();
  const rootNavigationState = useRootNavigationState();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const db = useDB();
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const val = await getItem('@firstLaunch');
        setIsFirstLaunch(val === null);
      } catch (e) {
        setIsFirstLaunch(false);
      }
    };
    checkStatus();
  }, []);

  const filtered = useFuzzySearchList({
    list: themen,
    queryText: query,
    getText: (item) => [item.course_name],
    mapResultItem: ({item}) => item,
  });

  if (isFirstLaunch === null || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  const isDark = theme === 'dark';

  // Register the user in the database
  const next_step = (course_id: string) => {
    if (!db) return;
    db.general.user.upsert({
      id: userId.toString(),
      current: true,
      intensity: intensity,
      role: role,
      name: name,
      username: username,
      course: course_id,
      courseHistory: [course_id,],
      currentChapter: 1,
      currentCourseCompletedChapters: [],
    });
    completeIntro();
    // Return to the Home page
    router.navigate("/(tabs)/Home");
  }


  const tint = '#0a7ea4';
   return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.heading}>Suche</ThemedText>
        <ThemedText style={[styles.label, { color: Colors[theme].icon }]}>
          Choose the course you would like to start with
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
              <ThemedText type="defaultSemiBold" style={[styles.kursTitle, { color: tint }]}>
                {thema.course_name}
              </ThemedText>
              <View style={[styles.card, { backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}>
                
                {COURSE_IMAGES[thema.course_id] ? (
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                    next_step(thema.course_id);
                  }}>

                    <Image 
                      source={COURSE_IMAGES[thema.course_id]} 
                      style={styles.cardImage} 
                      resizeMode="cover" 
                    />

                  </TouchableOpacity>
                ) : (
                  <IconSymbol name="photo" size={40} color={Colors[theme].icon} />
                )}
                
                {/* Information about the course */}
                <TouchableOpacity
                  style={[
                    styles.information,
                    { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 2, borderColor: '#fff' },
                  ]}
                  onPress={() => {}}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name="bookmark.fill"
                    size={16}
                    color={'rgba(255,255,255,0.5)'}
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
    paddingTop: 64,
    paddingBottom: 32,
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
    fontSize: 15,
    marginBottom: 8,
  },
  card: {
    height: 120,
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
});
