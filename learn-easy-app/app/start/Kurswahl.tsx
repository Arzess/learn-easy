import { useState, useId, useEffect} from 'react';
import { Image, Modal, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, Touchable, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { colors, fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { completeIntro, getItem } from '../index';
import { useDB } from '@/db/DatabaseContext';
import Svg from '@/components/svg'
import '@/components/svg-sheet'
import useFuzzySearchList from '@nozbe/microfuzz/dist/react/useFuzzySearchList';
// Course structure and content
import courses from '@/assets/courses.json'

const themen = courses.courses;
export default function Kurswahl() {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useColorScheme();
  const userId = useId();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [currentCourse, setCurrentCourse] = useState("");
  const [currentDesc, setCurrentDesc] = useState("");
  const {name, username, role, intensity} = useLocalSearchParams();
  const db = useDB();

  // Fetch the user data
  useEffect(()=>{
    const fetchUser = async () => {
      if (!db) return;

      // @ts-ignore
      const user = await db.general.user.findOne({
        selector: { current: {$eq: true}}
      }).exec();

      if (user){
        setUserData(user.toJSON())
      }
    };



    fetchUser();

  }, [db]);

  const filtered = useFuzzySearchList({
    list: themen.filter(t => !userData?.courseHistory?.includes(t.course_id)),
    queryText: query,
    getText: (item) => [item.course_name],
    mapResultItem: ({item}) => item,
  });
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
      completedCourses: [],
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
        <Text style={[styles.heading, fonts.josefin, fonts.josefinMedium, { color: colors.white.color }]}>Choose your course</Text>
        <ThemedText style={[styles.label, fonts.josefin, { color: Colors[theme].icon }]}>
          Choose your next course or the one you would like to start with
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
            placeholder="e.g Mongolian Empire"
            placeholderTextColor={"#ffffff66"}

            returnKeyType="search"
          />
          <IconSymbol name="magnifyingglass" size={18} color={Colors[theme].icon} />
        </View>

        <Text style={[styles.ergebnisse, { color: colors.white.color }]}>
          {filtered.length} Ergebnisse
        </Text>

        {/* Information modal */}

        <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeading}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Svg icon="close" width={24} height={24} white={false} />
                </TouchableOpacity>
                <Text style={[fonts.josefin, styles.modalHeadingText]}>{currentCourse}</Text>
              </View>
              <Text style={[fonts.josefin, styles.modalText]}>{currentDesc}</Text>
            </View>
          </View>
        </Modal>

        {/* Karten */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {filtered.map(thema => (
            <View key={thema.course_id} style={styles.kursBlock}>
              <ThemedText type="defaultSemiBold" style={[styles.kursTitle, { color: colors.white.color }, fonts.josefin]}>
                {thema.course_name}
              </ThemedText>
              <View style={[styles.card, { backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}>
              
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                    next_step(thema.course_id);
                  }}>

                    <Image 
                      source={{ uri: thema.course_cover_id}} 
                      style={styles.cardImage} 
                      resizeMode="cover" 
                    />

                  </TouchableOpacity>
                {/* Information about the course */}
                <TouchableOpacity
                  style={[
                    styles.information,
                    { backgroundColor: colors.whiteBg.backgroundColor, borderWidth: 2, borderColor: '#fff' },
                  ]}
                  onPress={() => {
                    setCurrentCourse(thema.course_name);
                    setCurrentDesc(thema.course_description);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Svg
                    icon="information"
                    width={24}
                    height={24}
                    white={true}
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
    fontSize: 32,
  },
  label: {
    fontSize: 16,
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
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flexDirection: 'column',
    gap: 32,
    backgroundColor: 'white',
    width: '80%',
    height: 'auto',
    borderRadius: 16,
    padding: 16,
  },
  modalHeading: {
      display: 'flex',
      gap: 16,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
  },
  modalHeadingText: {
      fontSize: 24,
  },
  closeButton: {
    padding: 16,
  },
  modalText: {
    fontSize: 16,
  }
});
