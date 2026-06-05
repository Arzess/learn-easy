// mit KI bearbeitet – neuer Introduction-Screen vor Chapter 1 mit Kursübersicht und "Start Chapter 1"-Button
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fonts, colors } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/Button';
import courses from '@/assets/courses.json';

export default function CourseIntro() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useColorScheme();
  const router = useRouter();
  const isDark = theme === 'dark';
  const textColor = Colors[theme].text;
  const subColor = Colors[theme].icon;

  const course = courses.courses.find(c => String(c.course_id) === String(courseId));

  if (!course) return null;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button text="" iconName="arrow-left" onPress={() => router.back()} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48 }} />
        <Text style={[fonts.josefinBold, styles.headerTitle, { color: textColor }]} numberOfLines={1}>
          {course.course_name}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <Image source={{ uri: course.course_cover_id }} style={styles.cover} resizeMode="cover" />

        {/* Intro text */}
        <View style={styles.introBox}>
          <Text style={[fonts.josefinBold, styles.introTitle, { color: textColor }]}>Introduction</Text>
          <Text style={[fonts.josefin, styles.introDesc, { color: subColor }]}>{course.course_description}</Text>
        </View>

        {/* What you will learn */}
        <View style={styles.section}>
          <Text style={[fonts.josefinBold, styles.sectionTitle, { color: textColor }]}>What you will learn</Text>
          {course.chapters.map((chapter, index) => (
            <View key={chapter.chapter_id} style={[styles.chapterRow, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5', borderColor: isDark ? '#333' : '#e0e0e0' }]}>
              <View style={[styles.numberBadge, { backgroundColor: isDark ? '#333' : '#ddd' }]}>
                <Text style={[fonts.josefinBold, { color: textColor, fontSize: 13 }]}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[fonts.josefinBold, { color: textColor, fontSize: 14 }]}>{chapter.chapter_name}</Text>
                <Text style={[fonts.josefin, { color: subColor, fontSize: 13, lineHeight: 18 }]}>{chapter.chapter_desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Button */}
      <View style={styles.buttonBar}>
        <Button
          text="Start Chapter 1"
          iconName="chevron-right"
          light={true}
          darkIcon={true}
          fullWidth={true}
          onPress={() => router.replace({
            pathname: '/ChapterContent',
            params: { courseId: course.course_id, chapterId: String(course.chapters[0].chapter_id) }
          })}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  content: {
    padding: 16,
  },
  introBox: {
    marginBottom: 24,
    gap: 8,
  },
  introTitle: {
    fontSize: 22,
  },
  introDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
});
