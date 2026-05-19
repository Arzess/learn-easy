import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import { colors, fonts } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import Svg from '@/components/svg';
import courses from '@/assets/courses.json';

export default function CourseOverview() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useColorScheme();
  const db = useDB();
  const router = useRouter();
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const course = courses.courses.find(c => String(c.course_id) === String(courseId));

  useFocusEffect(useCallback(() => {
    if (!db) return;
    const fetchUser = async () => {
      // @ts-ignore
      const user = await db.general.user.findOne({
        selector: { current: { $eq: true } },
      }).exec();
      if (user) {
        setCompletedChapters(user.toJSON().currentCourseCompletedChapters ?? []);
      }
      setLoading(false);
    };
    fetchUser();
  }, [db]));

  const isDark = theme === 'dark';
  const tint = colors.white.color;
  const textColor = Colors[theme].text;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!course) {
    return (
      <ThemedView style={styles.container}>
        <Text style={[fonts.josefin, { color: textColor }]}>Course not found.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Svg icon="chevron-left" width={24} height={24} white={isDark} />
        </TouchableOpacity>
        <Text style={[fonts.josefin, fonts.josefinBold, styles.headerTitle, { color: textColor }]} numberOfLines={1}>
          {course.course_name}
        </Text>
      </View>

      {/* Cover image */}
      <Image
        source={{ uri: course.course_cover_id }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      {/* Chapters */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        <Text style={[fonts.josefin, styles.sectionLabel, { color: Colors[theme].icon }]}>
          {course.amount_of_chapters} Chapters
        </Text>

        {course.chapters.map((chapter, index) => {
          const done = completedChapters.map(String).includes(String(chapter.chapter_id));
          return (
            <TouchableOpacity
              key={chapter.chapter_id}
              activeOpacity={0.75}
              onPress={() => router.push({
                pathname: '/ChapterContent',
                params: { courseId: course.course_id, chapterId: String(chapter.chapter_id) }
              })}
              style={[styles.card, {
                backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0',
                borderColor: done ? tint : (isDark ? '#444' : '#e0e0e0'),
                borderWidth: done ? 2 : 1,
              }]}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.numberBadge, { backgroundColor: done ? tint : (isDark ? '#444' : '#d0d0d0') }]}>
                  <Text style={[fonts.josefin, styles.numberText]}>{index + 1}</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={[fonts.josefin, fonts.josefinBold, styles.chapterName, { color: Colors[theme].text }]}>
                  {chapter.chapter_name}
                </Text>
              </View>
              {done && (
                <View style={styles.checkmark}>
                  <Svg icon="checkmark" width={18} height={18} white={true} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 180,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  chapterName: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
