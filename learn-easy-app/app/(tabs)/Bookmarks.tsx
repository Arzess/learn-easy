import { StyleSheet, View, Text, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import courses from "@/assets/courses.json"

export default function Bookmarks() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [courseHistory, setCourseHistory] = useState<any>([]);
  const db = useDB();

  useEffect(()=>{

  const fetchCourseId = async () => {
    if (!db) return;

    const user = await db.general.user.findOne({
      selector: { current: {$eq: true}}
    }).exec();

    if (user){
      const course = courses.courses.find(c => String(c.course_id) === String(user.toJSON().course));
      const history = user.toJSON().courseHistory;
      if (course){
        setCourseId(course.course_id)
      } 
      if (history){
        setCourseHistory(history)
      }
    }
  }

  fetchCourseId();


  }, [db])


  return (
      <ThemedView style={styles.container}>
         <View style={styles.titleContainer}>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]} className="heading">Bookmarks</Text>
            <Text style={[fonts.josefin, { color: textColor }]}>Browse through your saved content in every course you ever had.</Text>
          </View>

          <View style={styles.categories}>
            <FlatList data={courseHistory} keyExtractor={item => item} ItemSeparatorComponent={() => <View style={{ height: 16 }} />} renderItem={({ item }) => {
                const course = courses.courses.find(c => String(c.course_id) === String(item));
                if (!course) return null;
                return (
                  <Card
                    subtext="Course"
                    text={course.course_name}
                    onPress={() => {
                      router.push({
                        pathname: "/bookmarks/BookmarksGeneral",
                        params: { courseId: item },
                      });
                    }}
                  />
                );
                }}
          />
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
    paddingTop: 64,
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