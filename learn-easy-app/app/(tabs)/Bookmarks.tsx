import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import courses from '@/assets/courses.json';

export default function Bookmarks() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const router = useRouter();
  const db = useDB();
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (!db) return;
    const fetch = async () => {
      const user = await db.general.user.findOne({
        selector: { current: { $eq: true } },
      }).exec();
      if (user) {
        const course = courses.courses.find(
          c => String(c.course_id) === String(user.toJSON().course)
        );
        if (course) setCourseId(String(course.course_id));
      }
    };
    fetch();
  }, [db]);

  const categories = [
    { label: 'Texts', path: '/bookmarks/Texts' },
    { label: 'Pictures', path: '/bookmarks/Pictures' },
    { label: 'Videos', path: '/bookmarks/Videos' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]}>
          Bookmarks
        </Text>
        <Text style={[fonts.josefin, { color: textColor }]}>
          Browse through your saved content
        </Text>
      </View>

      <View style={styles.categories}>
        {categories.map(cat => (
          <Card
            key={cat.label}
            subtext="Category"
            text={cat.label}
            onPress={() =>
              router.push({ pathname: cat.path as any, params: { courseId } })
            }
          />
        ))}
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
    flexDirection: 'column',
    gap: 24,
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  categories: {
    flexDirection: 'column',
    gap: 16,
  },
});
