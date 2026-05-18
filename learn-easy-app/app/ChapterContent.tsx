import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors, fonts } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import Svg from '@/components/svg';
import { useDB } from '@/db/DatabaseContext';
import { addBookmark, removeBookmark, bookmarkCounter } from '@/db/database';
import courses from '@/assets/courses.json';

export default function ChapterContent() {
  const { courseId, chapterId, contentId } = useLocalSearchParams<{ courseId: string; chapterId: string; contentId?: string }>();
  const theme = useColorScheme();
  const router = useRouter();
  const db = useDB();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [bookmarkIdMap, setBookmarkIdMap] = useState<Record<number, string>>({});
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [showCongrats, setShowCongrats] = useState(false);

  const course = courses.courses.find(c => String(c.course_id) === String(courseId));
  const chapter = course?.chapters.find(ch => String(ch.chapter_id) === String(chapterId));

  const initialIndex = (() => {
    if (!contentId || !chapter) return 0;
    const idx = (chapter.chapter_content as any[]).findIndex(item => String(item.content_id) === String(contentId));
    return idx >= 0 ? idx : 0;
  })();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const isDark = theme === 'dark';
  const tint = '#0a7ea4';
  const textColor = Colors[theme].text;

  useEffect(() => {
    if (!db) return;
    const loadBookmarks = async () => {
      const res = await db.general.bookmarks.find().exec();
      const ids = new Set<number>();
      const idMap: Record<number, string> = {};
      res.forEach((b: any) => {
        const data = b.toJSON();
        ids.add(data.inhaltsId);
        idMap[data.inhaltsId] = data.bookmarkId;
      });
      setBookmarkedIds(ids);
      setBookmarkIdMap(idMap);
    };
    loadBookmarks();
  }, [db]);

  if (!course || !chapter) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const setQuiz = async () => {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('@quizIncompleted', 'true');
  }

  const toggleBookmark = (content_id: number, type: string, url: string) => {
    if (bookmarkedIds.has(content_id)) {
      removeBookmark(db, bookmarkIdMap[content_id]);
      setBookmarkedIds(prev => { const next = new Set(prev); next.delete(content_id); return next; });
      setBookmarkIdMap(prev => { const next = { ...prev }; delete next[content_id]; return next; });
    } else {
      const newId = String(bookmarkCounter);
      addBookmark(db, content_id, type, url);
      setBookmarkedIds(prev => new Set(prev).add(content_id));
      setBookmarkIdMap(prev => ({ ...prev, [content_id]: newId }));
    }
  };

  const finishChapter = async () => {
    if (!db) return;
    // @ts-ignore
    const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
    if (user) {
      const data = user.toJSON();
      const already = data.currentCourseCompletedChapters ?? [];
      let updated = already;
      if (!already.map(String).includes(String(chapterId))) {
        updated = [...already, String(chapterId)];
        await user.patch({ currentCourseCompletedChapters: updated, currentChapter: user.currentChapter+1 });
      }
      if (course && updated.length >= course.amount_of_chapters) {
        setShowCongrats(true);
        return;
      }
    }
    router.back();
  };

  const content = chapter.chapter_content;
  const total = content.length;
  const item = content[currentIndex] as any;
  const isBookmarked = bookmarkedIds.has(item.content_id);

  const labelMap: Record<string, string> = { text: 'Text', image: 'Image', video: 'Video' };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Svg icon="chevron-left" width={24} height={24} white={isDark} />
        </TouchableOpacity>
        <Text style={[fonts.josefin, fonts.josefinBold, styles.headerTitle, { color: textColor }]} numberOfLines={2}>
          {chapter.chapter_name}
        </Text>
        <TouchableOpacity
          style={[styles.chaptersBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }]}
          onPress={() => router.push({ pathname: '/CourseOverview', params: { courseId } })}
          activeOpacity={0.7}
        >
          <Svg icon="chapters" width={22} height={22} white={isDark} />
        </TouchableOpacity>
      </View>

      {/* Block */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.block, { backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5', borderColor: isDark ? '#333' : '#e0e0e0' }]}>
          {/* Block header */}
          <View style={styles.blockHeader}>
            <Text style={[fonts.josefin, styles.blockLabel, { color: Colors[theme].icon }]}>
              {labelMap[item.content_type] ?? item.content_type}
            </Text>
            <TouchableOpacity
              style={[styles.bookmarkBtn, { backgroundColor: '#fff' }]}
              onPress={() => {
                const url = item.content_type === 'image' ? item.image_source : item.content_type === 'video' ? item.link : '';
                toggleBookmark(item.content_id, item.content_type, url);
              }}
              activeOpacity={0.7}
            >
              <Svg icon={isBookmarked ? 'bookmark-filled' : 'bookmark-add'} width={18} height={18} white={false} />
            </TouchableOpacity>
          </View>

          {/* Text */}
          {item.content_type === 'text' && (
            <Text style={[fonts.josefin, styles.bodyText, { color: Colors[theme].text }]}>
              {item.content}
            </Text>
          )}

          {/* Image */}
          {item.content_type === 'image' && (
            <>
              <Image
                source={{ uri: imgErrors.has(item.content_id) ? course.course_cover_id : item.image_source }}
                style={styles.image}
                resizeMode="cover"
                onError={() => setImgErrors(prev => new Set(prev).add(item.content_id))}
              />
              <Text style={[fonts.josefin, styles.imageCaption, { color: Colors[theme].icon }]}>
                {item.image_alt}
              </Text>
            </>
          )}

          {/* Video */}
          {item.content_type === 'video' && (() => {
            const videoId = item.link.split('/embed/')[1]?.split('?')[0];
            const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
            return (
              <>
                <TouchableOpacity activeOpacity={0.85} onPress={() => Linking.openURL(watchUrl)} style={styles.videoThumbnailContainer}>
                  <Image source={{ uri: thumbnail }} style={styles.videoThumbnail} resizeMode="cover" />
                  <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.videoMeta}>
                  <Text style={[fonts.josefin, fonts.josefinBold, styles.videoTitle, { color: Colors[theme].text }]}>{item.title}</Text>
                  <Text style={[fonts.josefin, styles.videoDuration, { color: Colors[theme].icon }]}>{item.duration_minutes} min</Text>
                </View>
              </>
            );
          })()}
        </View>
      </ScrollView>

      {/* Finish Chapter Button */}
      {currentIndex === total - 1 && (
        <TouchableOpacity style={styles.finishBtn} onPress={finishChapter} activeOpacity={0.85}>
          <Text style={[fonts.josefin, fonts.josefinBold, styles.finishBtnText]}>Finish Chapter</Text>
          <Svg icon="chevron-right" width={20} height={20} white={false} />
        </TouchableOpacity>
      )}

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1, backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}
          onPress={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <Svg icon="chevron-left" width={24} height={24} white={isDark} />
        </TouchableOpacity>

        {/* Dots */}

        <View style={styles.dots}>
          {content.map((_: any, i: number) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === currentIndex ? tint : (isDark ? '#555' : '#ccc') }]} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navBtn, { opacity: currentIndex === total - 1 ? 0.3 : 1, backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}
          onPress={() => setCurrentIndex(i => i + 1)}
          disabled={currentIndex === total - 1}
          activeOpacity={0.7}
        >
          <Svg icon="chevron-right" width={24} height={24} white={isDark} />
        </TouchableOpacity>
      </View>
      {/* Congratulations Modal */}
      <Modal visible={showCongrats} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[fonts.josefin, styles.modalEmoji]}>🎉</Text>
            <Text style={[fonts.josefin, styles.modalTitle, colors.black]}>Congratulations!</Text>
            <Text style={[fonts.josefin, fonts.josefinBold, styles.modalHeading]}>
              You have finished all the chapters!
            </Text>
            <Text style={[fonts.josefin, styles.modalSub, colors.black]}>Are you ready for the quiz?</Text>
            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setShowCongrats(false);
                router.replace({ pathname: '/Quiz', params: { courseId } });
              }}
              activeOpacity={0.85}
            >
              <Text style={[fonts.josefin, fonts.josefinBold, styles.modalPrimaryBtnText]}>Take the quiz</Text>
              <Svg icon="chevron-right" width={18} height={18} white={false} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={() => { setShowCongrats(false); setQuiz(); router.back(); }}
              activeOpacity={0.85}
            >
              <Text style={[fonts.josefin, styles.modalSecondaryBtnText]}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    paddingTop: 2,
  },
  chaptersBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    flex: 1,
    lineHeight: 26,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  block: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 26,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  imageCaption: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  videoThumbnailContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 22,
    marginLeft: 4,
  },
  videoMeta: {
    gap: 4,
  },
  videoTitle: {
    fontSize: 14,
  },
  videoDuration: {
    fontSize: 12,
  },
  finishBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  finishBtnText: {
    fontSize: 15,
    color: '#000',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  modalEmoji: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 16,
    color: '#555',
  },
  modalHeading: {
    fontSize: 26,
    color: '#000',
    textAlign: 'center',
    lineHeight: 34,
  },
  modalSub: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  modalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
  },
  modalPrimaryBtnText: {
    color: '#fff',
    fontSize: 15,
  },
  modalSecondaryBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: '#000',
    fontSize: 15,
  },
});
