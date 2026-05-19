import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Button from '@/components/Button';
import { useDB } from '@/db/DatabaseContext';
import Svg from '@/components/svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import courses from "@/assets/courses.json"

export default function Quiz() {
    const theme = useColorScheme();
    const textColor = Colors[theme].text;
    const router = useRouter();
    const { courseId, chapterId } = useLocalSearchParams<{ courseId: string; chapterId: string }>();
    const [course, setCourse] = useState<any>(null);
    const [currentCourse, setCurrentCourse] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [questionCounter, setQuestionCounter] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState<Map<Number, Array<String>>>();
    const db = useDB(); 
    useEffect(()=>{ 
        const fetchCourseInfo = async () => {
            const foundCourse = courses.courses.find(c => String(c.course_id) === String(courseId));
            if (foundCourse) {
              setCurrentCourse(foundCourse);
              const foundChapter = foundCourse.chapters.find(ch => String(ch.chapter_id) === String(chapterId));
              if (foundChapter) {
                setCourse(foundChapter);
              }
            }
        }
      fetchCourseInfo();
    }, []);
    const questionType = new Map([
        ["multiple_choice", "Multiple Choice"],
        ["single_choice", "Single Choice"],
    ])

    // Map will be passed to quiz result page for assessment
    useEffect(() => {
      if (!course) return;
      const answerSheet = new Map<number, string[]>();
      for (let i = 1; i <= course?.quiz?.questions?.length; i++) {
        answerSheet.set(i, []);
      }
      setSubmittedAnswers(answerSheet);
    }, [course]);

    return (
        <ThemedView style={styles.container}>
          <View style={styles.titleContainer}>
            {/* Problem: Zurück-Button fehlte und Texte waren im Light Mode nicht lesbar – mit KI behoben */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Svg icon="arrow-left" width={20} height={20} white={theme === 'dark'} />
            </TouchableOpacity>
            <Text style={[fonts.josefin, { color: textColor }]}>Quiz</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]}>
              {currentCourse?.course_name}
            </Text>
          </View>

          {/* Quiz content */}
          <FlatList
            style={{flex: 1,}}
            data={course?.quiz?.questions ?? []}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
            renderItem={({ item, index }) => {
              if (!item) return null;
              const questionNumber = index + 1;
            
              return (
                <View style={styles.question}>
                    <View style={styles.questionTextContainer}>
                      <Text style={[styles.questionType, fonts.josefin]}>
                        {questionType.get(item.question_type)}
                      </Text>
                      <View style={styles.textContainer}>
                        <Text style={[fonts.josefin, fonts.josefinMedium, {fontSize: 16}]}>
                          Question {questionNumber}
                        </Text>
                        <Text style={[fonts.josefin, fonts.josefinMedium, {fontSize: 20}]}>
                          {item.question_content}
                        </Text>
                      </View>
                    </View>

                    {/* Answers */}
                    {item.answers.map((answer: any, i: number) => {
                      const isSelected = submittedAnswers?.get(questionNumber)?.includes(answer.answer_label);
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[styles.answer, isSelected && { borderWidth: 2, borderColor: colors.primaryBg.backgroundColor }]}
                          onPress={() => {
                            const current = submittedAnswers?.get(questionNumber) ?? [];
                            if (!isSelected) {
                              setSubmittedAnswers(prev => {
                                const next = new Map(prev);
                                next.set(questionNumber, [...current, answer.answer_label]);
                                return next;
                              });
                            } else {
                              setSubmittedAnswers(prev => {
                                const next = new Map(prev);
                                next.set(questionNumber, current.filter(a => a !== answer.answer_label));
                                return next;
                              });
                            }
                          }}
                        >
                          <View style={styles.answerTextContainer}>
                            <Text style={[fonts.josefin, styles.answerLabel,]}>
                              {answer.answer_label}
                            </Text>
                            <Text style={[fonts.josefin, fonts.josefinMedium, {color: colors.white.color}]}>
                              {answer.answer_content}
                            </Text>
                          </View>
                          {isSelected && (
                            <View style={styles.selected}>
                              <Text style={[fonts.josefin, { fontSize: 12, color: colors.black.color, }]}>Selected</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                </View>
              );
            }}
          />

        {/* Confirmation modal */}
        <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeadingContainer}>
                    <Text style={[fonts.josefin, fonts.josefinMedium]}>You sure?</Text>
                    <Text style={[fonts.josefin, fonts.josefinMedium, {fontSize: 24, textAlign: 'center',}]}>Have you checked all your answers?</Text>
                    <Text style={[fonts.josefin, fonts.josefinMedium]}>Better safe than sorry.</Text>
                </View>
                <View style={styles.modalOptions}>
                    <Button text="Submit the answers" style={styles.modalButton} light={false} iconName="chevron-right" fullWidth={true} darkIcon={false} onPress={()=>{
                        router.push({
                            pathname: "/QuizResult",
                            params: {
                                answers: JSON.stringify(Array.from(submittedAnswers?.entries() ?? [])),
                                courseId: courseId,
                                chapterId: chapterId,
                            },
                        });
                    }} />
                    <Button text="Take another look" style={styles.modalButton} noIcon={true} light={false} iconName="chevron-right" fullWidth={true} darkIcon={false} onPress={()=>{
                        setModalVisible(!modalVisible);
                    }} />
                </View>
            </View>
          </View>
        </Modal>

          {/* Submit button */}
          <View style={styles.buttonContainer}>
            <Button
              text="Check the answers"
              iconName="chevron-right"
              light={true}
              darkIcon={true}
              fullWidth={true}
              onPress={() => {
                setModalVisible(true);
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
    paddingBottom: 32,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  titleSubContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  buttonContainer: {
    height: 50,
  },
  question: {
    padding: 16,
    backgroundColor: colors.whiteBg.backgroundColor,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  questionType: {
    fontSize: 14,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  questionTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }, 
  answer: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.blackBg.backgroundColor,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 32,
    padding: 16,
  },
  answerTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  answerLabel: {
    fontSize: 14,
    color: colors.white.color,
  },
  questionText: {
    fontSize: 20,
  },
  selected: {
    padding: 8,
    backgroundColor: colors.whiteBg.backgroundColor,
    height: 'auto',
    borderRadius: 8,
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
      gap: 64,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      height: '80%',
      borderRadius: 16,
      padding: 16,
    },
    modalHeadingContainer: {
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    modalButton: {
        minHeight: 50,
    }
});