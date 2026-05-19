import { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Button from '@/components/Button';
import Svg from '@/components/svg';
import '@/components/svg-sheet';
import { ThemedView } from '@/components/themed-view';
import { Colors, fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import courses from '@/assets/courses.json';
import { colors } from '@/constants/theme';

type ResultItem = {
  content_id: number;
  content_type: string;
  content?: string;
  image_source?: string;
  image_alt?: string;
  video_title?: string;
  video_link?: string;
  duration_minutes?: number;
  course_id: string;
  chapter_id: number;
  chapter_name: string;
  course_name: string;
};

function searchCourses(query: string, activeCourseId: string): ResultItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: ResultItem[] = [];
  const seen = new Set<string>();

  const coursesToSearch = activeCourseId
    ? courses.courses.filter(c => String(c.course_id) === String(activeCourseId))
    : courses.courses;

  for (const course of coursesToSearch) {
    for (const chapter of course.chapters) {
      for (const item of chapter.chapter_content as any[]) {
        let matches = false;
        if (item.content_type === 'text' && item.content?.toLowerCase().includes(q)) matches = true;
        if (item.content_type === 'image' && item.image_alt?.toLowerCase().includes(q)) matches = true;
        if (item.content_type === 'video' && item.title?.toLowerCase().includes(q)) matches = true;
        if (chapter.chapter_name.toLowerCase().includes(q)) matches = true;
        if (course.course_name.toLowerCase().includes(q)) matches = true;

        if (!matches) continue;

        // Deduplicate by actual content value
        const dedupeKey =
          item.content_type === 'image' ? `img:${item.image_source}` :
          item.content_type === 'video' ? `vid:${item.link}` :
          `txt:${(item.content ?? '').slice(0, 80)}`;

        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);

        results.push({
          content_id: item.content_id,
          content_type: item.content_type,
          content: item.content,
          image_source: item.image_source,
          image_alt: item.image_alt,
          video_title: item.title,
          video_link: item.link,
          duration_minutes: item.duration_minutes,
          course_id: course.course_id,
          chapter_id: chapter.chapter_id,
          chapter_name: chapter.chapter_name,
          course_name: course.course_name,
        });
      }
    }
  }
  return results;
}

export default function SucheScreen() {
  const theme = useColorScheme();
  const router = useRouter();
  const db = useDB();
  const [activeCourseId, setActiveCourseId] = useState('');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [lastQueries, setLastQueries] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!db) return;
    const fetchUser = async () => {
      // @ts-ignore
      const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
      if (user) setActiveCourseId(String(user.toJSON().course ?? ''));
    };
    fetchUser();
  }, [db]);

  const isDark = theme === 'dark';
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const cardBg = '#fff';
  const cardBorder = '#e8e8e8';

  function handleSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const found = searchCourses(trimmed, activeCourseId);
    setResults(found);
    setSubmittedQuery(trimmed);
    setShowResults(true);
    setLastQueries(prev => {
      const next = [trimmed, ...prev.filter(x => x !== trimmed)].slice(0, 5);
      return next;
    });
  }

  function handleBack() {
    setShowResults(false);
    setQuery(submittedQuery);
  }

  if (showResults) {
    return (
      <ThemedView style={styles.container}>
        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
          <View style={styles.resultsTitleBlock}>
            <Text style={[fonts.josefin, styles.resultsFor, { color: iconColor }]}>Results for</Text>
            <Text style={[fonts.josefin, fonts.josefinBold, styles.resultsQuery, { color: textColor }]}>
              {submittedQuery}
            </Text>
            <Text style={[fonts.josefin, styles.resultsCount, { color: iconColor }]}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsList}>
          {results.length === 0 && (
            <Text style={[fonts.josefin, { color: iconColor, textAlign: 'center', marginTop: 32 }]}>
              No results found.
            </Text>
          )}

          {results.map((item, idx) => (
            <View key={`${item.content_id}-${idx}`} style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              {/* Card label row */}
              <View style={styles.cardLabelRow}>
                <Text style={[fonts.josefin, styles.cardLabel, { color: iconColor }]}>
                  {item.content_type === 'text' ? 'Text' : item.content_type === 'image' ? 'Image' : 'Video'}
                </Text>
                <TouchableOpacity
                  style={styles.sourceBtn}
                  onPress={() => router.push({ pathname: '/ChapterContent', params: { courseId: item.course_id, chapterId: String(item.chapter_id), contentId: String(item.content_id) } })}
                  activeOpacity={0.7}
                >
                  <Text style={[fonts.josefin, styles.sourceBtnText]}>Source</Text>
                  <Svg icon="chevron-right" width={14} height={14} white={false} />
                </TouchableOpacity>
              </View>

              {/* Image */}
              {item.content_type === 'image' && (
                <>
                  <Image
                    source={{ uri: imgErrors.has(item.content_id) ? 'https://images.pexels.com/photos/5275474/pexels-photo-5275474.jpeg' : item.image_source! }}
                    style={styles.resultImage}
                    resizeMode="cover"
                    onError={() => setImgErrors(prev => new Set(prev).add(item.content_id))}
                  />
                  {item.image_alt ? (
                    <Text style={[fonts.josefin, styles.imageCaption, { color: iconColor }]}>{item.image_alt}</Text>
                  ) : null}
                </>
              )}

              {/* Text */}
              {item.content_type === 'text' && (
                <Text style={[fonts.josefin, styles.textContent, { color: '#333' }]} numberOfLines={6} ellipsizeMode="tail">
                  {item.content}
                </Text>
              )}

              {/* Video */}
              {item.content_type === 'video' && (() => {
                const videoId = item.video_link?.split('/embed/')[1]?.split('?')[0];
                const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                return (
                  <View style={styles.videoRow}>
                    <Image source={{ uri: thumbnail }} style={styles.videoThumb} resizeMode="cover" />
                    <View style={styles.videoMeta}>
                      <Text style={[fonts.josefin, fonts.josefinBold, styles.videoTitle, { color: '#111' }]} numberOfLines={2}>
                        {item.video_title}
                      </Text>
                      <Text style={[fonts.josefin, styles.videoDuration, { color: iconColor }]}>
                        {item.duration_minutes} min
                      </Text>
                    </View>
                  </View>
                );
              })()}

              {/* Chapter tag */}
              <Text style={[fonts.josefin, styles.chapterTag, { color: iconColor }]}>
                {item.course_name} · {item.chapter_name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]}>Search</Text>
      <View style={[{flex: 1, display: 'flex', justifyContent: 'flex-end'}, !lastQueries.length && styles.noSearches, ]}>
        <Text style={[fonts.josefin, fonts.josefinMedium, styles.label, { color: iconColor }]}>Quickly find interesting material</Text>

      {/* Search bar */}
        <View style={[styles.searchBar, {
        backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0',
        borderColor: isDark ? '#444' : '#ddd',
      }]}>
        <TextInput
          style={[fonts.josefin, styles.input, { color: textColor }]}
          value={query}
          onChangeText={setQuery}
          placeholder="e.g Mongolia"
          placeholderTextColor={'#61646B'}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(query)}
        />
        <TouchableOpacity onPress={() => handleSearch(query)} activeOpacity={0.7}>
          <IconSymbol name="magnifyingglass" size={18} color={iconColor} />
        </TouchableOpacity>
      </View>

      </View>
      {/* Last queries */}
      {lastQueries.length > 0 && (
        <View style={[styles.lastQueriesCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[fonts.josefin, fonts.josefinMedium, styles.lastQueriesTitle]}>Last queries</Text>
          <View style={{width: '100%', height: 1, marginBottom: 16, backgroundColor: colors.blackBg.backgroundColor}}></View>
          {lastQueries.map((q, i) => (
            <TouchableOpacity key={i} onPress={() => { setQuery(q); handleSearch(q); }} activeOpacity={0.7}>
              <Text style={[fonts.josefin, fonts.josefinMedium, styles.lastQueryItem]}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
  },
  label: {
    fontSize: 13,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  lastQueriesCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    flex: 1,
  },
  lastQueriesTitle: {
    fontSize: 16,
    color: '#111',
    padding: 16,
  },
  lastQueryItem: {
    fontSize: 16,
    textDecorationLine: 'underline',
    paddingVertical: 2,
    padding: 16,
  },
  // Results
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtn: {
    marginTop: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitleBlock: {
    flex: 1,
    gap: 2,
  },
  resultsFor: {
    fontSize: 13,
  },
  resultsQuery: {
    fontSize: 28,
    lineHeight: 34,
  },
  resultsCount: {
    fontSize: 13,
    marginTop: 2,
  },
  resultsList: {
    gap: 14,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sourceBtnText: {
    fontSize: 12,
    color: '#111',
  },
  resultImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  imageCaption: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  textContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  videoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  videoThumb: {
    width: 100,
    height: 68,
    borderRadius: 8,
  },
  videoMeta: {
    flex: 1,
    gap: 4,
  },
  videoTitle: {
    fontSize: 13,
  },
  videoDuration: {
    fontSize: 12,
  },
  chapterTag: {
    fontSize: 11,
  },
  noSearches: {
    justifyContent: 'center',
  }
});
