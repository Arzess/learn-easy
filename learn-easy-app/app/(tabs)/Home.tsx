import { getItem } from "@/app/index";
import courses from "@/assets/courses.json";
import Button from "@/components/Button";
import Svg from "@/components/svg";
import { ThemedView } from "@/components/themed-view";
import { colors, fonts, Colors } from "@/constants/theme";
import { addBookmark, removeBookmark } from "@/db/database";
import { useDB } from "@/db/DatabaseContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router, useFocusEffect } from "expo-router";
import { createClient } from "pexels";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;
const carouselWidth = width;

const difficulties = new Map([
  ["hard", "5x a day"],
  ["easy", "1x a day"],
  ["medium", "3x a day"],
]);

export default function Home() {
  const theme = useColorScheme();
  const db = useDB();
  const [userData, setUserData] = useState<any>(null);
  const [pictures, setPictures] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [bookmarkedIds, setBookmarkedImagesIds] = useState<Set<number>>(
    new Set(),
  );
  const [currentCourse, setCurrentCourse] = useState<
    (typeof courses.courses)[0] | null
  >(null);
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [quiz, setQuiz] = useState(false);
  const [courseRating, setCourseRating] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Check if there's a quiz to be completed
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const val = await getItem("@quizIncompleted");
        setQuiz(val !== "false");
      } catch (e) {
        setQuiz(false);
      }
    };
    checkStatus();
  }, []);

  // Fetch the user data and random pictures
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        if (!db) return;

        // Fetch random related pictures
        const fetchPictures = async (courseName: string) => {
          try {
            const client = createClient(
              "dnXMyimAOpRQXMPQe1Vr6TsayuxePRRb7Ox3hY9NOpMpTp0kt8VlOqb7",
            );
            const query = courseName;
            const res = await client.photos.search({ query, per_page: 4 });
            if ("photos" in res) {
              const pictures = res.photos.map((pic: any) => ({
                source: { uri: pic.src.large },
                type: "image",
                content_id: pic.id,
              }));
              let nothingFound = pictures.length === 0;
              setPictures(pictures as any);
              setNoResult(nothingFound);
            }
          } catch (e) {
            setNoResult(true);
            console.log(
              `There was an error while fetching random pictures: ${e}`,
            );
          }
        };

        // @ts-ignore
        const user = await db.general.user
          .findOne({
            selector: { current: { $eq: true } },
          })
          .exec();

        if (user) {
          setUserData(user.toJSON());
          const course = courses.courses.find(
            (c) => String(c.course_id) === String(user.toJSON().course),
          );
          if (course) {
            setCurrentCourse(course);
            fetchPictures(course.course_name);
            const savedRating = await getItem(`@rating_${course.course_id}`);
            setCourseRating(savedRating ? parseInt(savedRating, 10) : 0);
          }
        }
      };

      fetchUser();
    }, [db]),
  );

  // Load bookmarks
  useEffect(() => {
    const loadBookmarked = async () => {
      if (!db) return;
      const res = await db.general.bookmarks
        .find({
          selector: { inhaltsTyp: { $eq: "image" } },
        })
        .exec();
      const ids = new Set<number>(res.map((b: any) => b.toJSON().inhaltsId));
      setBookmarkedImagesIds(ids);
    };
    if (pictures.length > 0) loadBookmarked();
  }, [pictures, db]);

  if (!userData) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const isDark = theme === "dark";
  const textColor = Colors[theme].text;

  // Coursedetails
  let completionRate = 0;
  let progressBarWidth = 0;
  if (currentCourse) {
    completionRate = Math.round(
      (userData.currentCourseCompletedChapters.length /
        currentCourse.amount_of_chapters) *
        100,
    );
    if (!completionRate) {
      progressBarWidth = 5;
    } else {
      progressBarWidth = completionRate;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            style={[
              fonts.josefin,
              fonts.josefinMedium,
              styles.heading,
              { color: textColor },
            ]}
            className="heading"
          >
            Welcome back, {userData.name}!
          </Text>
        </View>
        {/* Progress */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeadingContainer}>
            <Text
              style={[fonts.josefin, styles.categorySubheading, { color: textColor }]}
            >
              Progress
            </Text>
            <Text style={[fonts.josefin, styles.categoryHeading, { color: textColor }]}>
              Your goal
            </Text>
          </View>
          <View style={styles.progress}>
            {/* Course */}
            <TouchableOpacity
              style={styles.course}
              onPress={() => {
                router.push({
                  pathname: "/CourseOverview",
                  params: { courseId: currentCourse?.course_id },
                });
              }}
            >
              <View style={styles.courseImgContainer}>
                <Image
                  source={{ uri: currentCourse?.course_cover_id }}
                  style={styles.courseImg}
                  resizeMode="cover"
                ></Image>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressBarFilled,
                      { width: `${progressBarWidth}%` },
                    ]}
                  ></View>
                </View>
              </View>
              <View style={styles.courseDesc}>
                <View style={styles.textContainer}>
                  <Text style={[fonts.josefin, styles.subCourseHeading]}>
                    Course
                  </Text>
                  <Text
                    style={[
                      fonts.josefin,
                      fonts.josefinBold,
                      styles.courseHeading,
                    ]}
                  >
                    {currentCourse?.course_name}
                  </Text>
                  <Text style={[fonts.josefin, styles.chapterName]}>
                    Chapter {userData.currentChapter}
                  </Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={async () => {
                          const newRating = star === courseRating ? 0 : star;
                          setCourseRating(newRating);
                          if (currentCourse) {
                            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
                            AsyncStorage.setItem(`@rating_${currentCourse.course_id}`, String(newRating));
                          }
                        }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                      >
                        <Text style={[styles.star, { color: star <= courseRating ? '#f5a623' : '#ccc' }]}>
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.percentageContainer}>
                  <Text style={fonts.josefin}>{completionRate + "%"}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {/* Goal */}
            <TouchableOpacity style={styles.goal} onPress={() => setShowGoalModal(true)} activeOpacity={0.75}>
              <Text style={styles.goalEmoji}>🎯</Text>
              <View style={styles.textContainer}>
                <Text
                  style={[fonts.josefin, fonts.josefinBold, styles.difficulty]}
                >
                  {userData.intensity.charAt(0).toUpperCase() +
                    userData.intensity.slice(1)}
                </Text>
                <Text style={[fonts.josefin, styles.frequency]}>
                  {difficulties.get(userData.intensity)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Jump Back in */}

        {/* Case 1: no quiz to do */}
        {!quiz && (
          <>
            <View style={styles.categoryContainer}>
              <View style={styles.categoryHeadingContainer}>
                <Text
                  style={[fonts.josefin, styles.categoryHeading, { color: textColor }]}
                >
                  Carry on with your course
                </Text>
              </View>
              <View style={styles.jumpBackIn}>
                <View style={styles.preview}>
                  <Text
                    style={[fonts.josefin, styles.chapterPreviewText]}
                    numberOfLines={8}
                    ellipsizeMode="tail"
                  >
                    {currentCourse?.chapters[0].chapter_content[0].content}
                  </Text>
                </View>
              </View>
              <Button
                text="Jump to the chapter"
                iconName="chevron-right"
                light={true}
                darkIcon={true}
                fullWidth={true}
                onPress={() => {
                  // To-do:
                  // 1: Navigate to the course
                  // 2: Pass the paramets "course_id" and "chapter"
                }}
              />
            </View>
          </>
        )}
        {/* Case 2: quiz to do */}
        {quiz && (
          <View style={styles.categoryContainer}>
            <View style={styles.categoryHeadingContainer}>
              <Text
                style={[fonts.josefin, styles.categoryHeading, { color: textColor }]}
              >
                Finish the quiz
              </Text>
              <Text style={[fonts.josefin, { color: textColor }]}>
                You have completed all the chapters - it's time for the{" "}
                {currentCourse?.course_name} quiz! Take it now.. or take your
                time, learn the material and hit the button whenever you are
                ready.
              </Text>
            </View>
            <Button
              text="Take the quiz"
              iconName="chevron-right"
              light={true}
              darkIcon={true}
              fullWidth={true}
              onPress={() => {
                const lastChapterId =
                  currentCourse?.chapters[currentCourse.chapters.length - 1]
                    ?.chapter_id;
                router.push({
                  pathname: "/Quiz",
                  params: {
                    courseId: currentCourse?.course_id,
                    chapterId: String(lastChapterId),
                  },
                });
              }}
            />
          </View>
        )}


        {/* Gallery */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeadingContainer}>
            <Text
              style={[fonts.josefin, styles.categorySubheading, { color: textColor }]}
            >
              Gallery
            </Text>
            <Text style={[fonts.josefin, styles.categoryHeading, { color: textColor }]}>
              Pictures you might like!
            </Text>
          </View>

          {pictures.length === 0 ? (
            <View
              style={{
                height: 220,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {noResult ? (
                <Text style={{ color: textColor }}>No pictures found.</Text>
              ) : (
                <ActivityIndicator color={textColor} />
              )}
            </View>
          ) : (
            <View style={{ height: 250 }}>
              <Carousel
                ref={ref}
                autoPlay={true}
                autoPlayInterval={4000}
                data={pictures}
                width={380}
                height={220}
                loop={true}
                pagingEnabled={true}
                snapEnabled={true}
                mode={"horizontal-stack"}
                modeConfig={{
                  snapDirection: "left",
                  stackInterval: 30,
                  scaleInterval: 0.08,
                  opacityInterval: 0.1,
                }}
                onProgressChange={progress}
                renderItem={({ item }: { item: any }) => (
                  <View style={styles.carouselItem}>
                    <TouchableOpacity
                      style={[
                        styles.bookmark,
                        {
                          backgroundColor: bookmarkedIds.has(item.content_id)
                            ? '#0a7ea4'
                            : colors.whiteBg.backgroundColor,
                          borderWidth: bookmarkedIds.has(item.content_id) ? 0 : 1,
                          borderColor: '#ccc',
                        },
                      ]}
                      onPress={() => {
                        if (bookmarkedIds.has(item.content_id)) {
                          removeBookmark(db, item.content_id);
                          setBookmarkedImagesIds((prev) => {
                            const next = new Set(prev);
                            next.delete(item.content_id);
                            return next;
                          });
                        } else {
                          addBookmark(
                            db,
                            item.content_id,
                            item.type,
                            item.source.uri,
                          );
                          setBookmarkedImagesIds((prev) =>
                            new Set(prev).add(item.content_id),
                          );
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Svg
                        icon={
                          bookmarkedIds.has(item.content_id)
                            ? "bookmark-filled"
                            : "bookmark-add"
                        }
                        width={16}
                        height={16}
                        white={false}
                      />
                    </TouchableOpacity>
                    <Image
                      source={item.source}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Goal / Intensity Modal */}
      <Modal visible={showGoalModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowGoalModal(false)}>
          <View style={[styles.modalBox, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <Text style={[fonts.josefin, fonts.josefinBold, styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
              Your daily goal
            </Text>
            {([
              { key: 'easy',   label: 'Easy',   freq: '1x a day' },
              { key: 'medium', label: 'Medium',  freq: '3x a day' },
              { key: 'hard',   label: 'Hard',    freq: '5x a day' },
            ] as const).map((opt) => {
              const active = userData.intensity === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.goalOption,
                    {
                      backgroundColor: active ? '#0a7ea4' : (isDark ? '#2c2c2e' : '#f0f0f0'),
                      borderColor: active ? '#0a7ea4' : (isDark ? '#444' : '#e0e0e0'),
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={async () => {
                    if (!db) return;
                    const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
                    if (user) {
                      await user.patch({ intensity: opt.key });
                      setUserData((prev: any) => ({ ...prev, intensity: opt.key }));
                    }
                    setShowGoalModal(false);
                  }}
                >
                  <Text style={[fonts.josefin, fonts.josefinBold, styles.goalOptionLabel, { color: active ? '#fff' : (isDark ? '#fff' : '#000') }]}>
                    {opt.label}
                  </Text>
                  <Text style={[fonts.josefin, styles.goalOptionFreq, { color: active ? 'rgba(255,255,255,0.8)' : (isDark ? '#aaa' : '#666') }]}>
                    {opt.freq}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },
  container: {
    flex: 1,
    paddingTop: 64,
  },
  carouselItem: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  progress: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: 16,
    height: 272,
  },
  categoryHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "flex-start",
  },
  categoryHeading: {
    fontSize: 24,
  },
  categorySubheading: {
    fontSize: 14,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  // Bookmark
  bookmark: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 32,
    zIndex: 5,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Course and goal
  course: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.whiteBg.backgroundColor,
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
  },
  courseImgContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: 128,
    height: 128,
  },
  courseImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  progressBar: {
    width: "100%",
    height: 5,
    backgroundColor: colors.whiteBg.backgroundColor,
    elevation: 3,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowColor: "black",
  },
  progressBarFilled: {
    height: 5,
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundColor: colors.primaryBg.backgroundColor,
  },
  courseDesc: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    flex: 1,
    maxHeight: 140,
    justifyContent: "space-between",
    alignItems: "center",
  },
  subCourseHeading: {
    fontSize: 12,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    justifyContent: "space-between",
  },
  chapterName: {
    fontSize: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  star: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalBox: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  goalOption: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 2,
  },
  goalOptionLabel: {
    fontSize: 16,
  },
  goalOptionFreq: {
    fontSize: 13,
  },
  goal: {
    backgroundColor: colors.whiteBg.backgroundColor,
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 4,
  },
  goalEmoji: {
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 24,
    padding: 16,
    backgroundColor: colors.secondary2BgLight.backgroundColor,
  },
  difficulty: {
    fontSize: 18,
  },
  frequency: {
    fontSize: 14,
  },
  courseHeading: {
    fontSize: 18,
  },
  percentageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // Jump Back in
  jumpBackIn: {
    minHeight: 160,
  },
  preview: {
    backgroundColor: colors.whiteBg.backgroundColor,
    padding: 16,
    borderRadius: 16,
    overflow: "hidden",
    flex: 1,
    maxHeight: 240,
  },
  chapterPreviewText: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexDirection: "column",
    gap: 24,
    padding: 16,
    paddingBottom: 32,
  },
});
