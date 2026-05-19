import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useDB } from '@/db/DatabaseContext';
import Button from '@/components/Button';
import NothingFound from '@/components/NothingFound';
import Svg from '@/components/svg';
import { removeBookmark } from '@/db/database';
import courses from '@/assets/courses.json';

type BookmarkItem = {
  bookmarkId: string;
  inhaltsTyp: string;
  inhaltsId: number;
  url: string;
};

export default function Texts() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const isDark = theme === 'dark';
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const db = useDB();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [noResults, setNoResults] = useState(false);

  const allContent = courses.courses
    .flatMap(c => c.chapters)
    .flatMap(ch => ch.chapter_content);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      const fetch = async () => {
        const res = await db.general.bookmarks.find().exec();
        const all = res.map((b: any) => b.toJSON());
        const results = all.filter((b: any) => b.inhaltsTyp === 'text');
        setBookmarks(results);
        setNoResults(results.length === 0);
      };
      fetch();
    }, [db])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleNavigationContainer}>
        <Button
          text=""
          iconName="arrow-left"
          onPress={() => router.back()}
          light={true}
          darkIcon={true}
          fullWidth={false}
          style={{ borderRadius: 999, width: 48, height: 48 }}
        />
        <View style={styles.titleContainer}>
          <Text style={[fonts.josefin, { color: textColor }]}>Bookmarks</Text>
          <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]}>
            Text
          </Text>
        </View>
      </View>

      {!noResults && (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item.bookmarkId}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => {
            const content = allContent.find((c: any) => c.content_id === item.inhaltsId);
            const parentCourse = courses.courses.find(c =>
              c.chapters.some(ch => (ch.chapter_content as any[]).some(cc => cc.content_id === item.inhaltsId))
            );
            const parentChapter = parentCourse?.chapters.find(ch =>
              (ch.chapter_content as any[]).some(cc => cc.content_id === item.inhaltsId)
            );
            return (
              <TouchableOpacity
                style={[styles.textCard, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff', borderColor: isDark ? '#333' : '#e0e0e0' }]}
                activeOpacity={0.75}
                onPress={() => {
                  if (parentCourse && parentChapter) {
                    router.push({
                      pathname: '/ChapterContent',
                      params: {
                        courseId: String(parentCourse.course_id),
                        chapterId: String(parentChapter.chapter_id),
                        contentId: String(item.inhaltsId),
                      },
                    });
                  }
                }}
              >
                <Text style={[fonts.josefin, styles.textContent, { color: textColor }]} numberOfLines={6} ellipsizeMode="tail">
                  {(content as any)?.content ?? ''}
                </Text>
                <TouchableOpacity
                  style={[styles.removeBtn, { backgroundColor: colors.whiteBg.backgroundColor }]}
                  onPress={() => {
                    removeBookmark(db, item.bookmarkId);
                    setBookmarks(prev => {
                      const updated = prev.filter(b => b.bookmarkId !== item.bookmarkId);
                      if (updated.length === 0) setNoResults(true);
                      return updated;
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Svg icon="bookmark-remove" width={16} height={16} white={true} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {noResults && (
        <NothingFound text="You don't have any text saved yet. Click on the bookmark icon in a chapter to add content here." />
      )}
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
    gap: 16,
  },
  titleNavigationContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  textCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  textContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
});
