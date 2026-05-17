import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors } from '@/constants/theme';
import Button from '@/components/Button';
import { useDB } from '@/db/DatabaseContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import courses from "@/assets/courses.json"

export default function QuizResult() {
    const router = useRouter();
    const { answers, courseId, chapterId } = useLocalSearchParams<{ answers: any, courseId: string; chapterId: string  }>();
    const [course, setCourse] = useState<any>(null);
    const [currentCourse, setCurrentCourse] = useState<any>(null);
    const [resultText, setResultText] = useState<string>("");
    const [passed, setPassed] = useState(false);
    const [helpText, setHelpText] = useState("You did well on this test! Now choose the next course you want to learn!");
    const [score, setScore] = useState(0);
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

    
    // To-do: check the answers
    useEffect(()=>{
        let userScore = 0;
        const answersMap = new Map<number, string[]>(JSON.parse(answers));
        let totalScore = course?.quiz?.questions?.length ?? 1;
        const foundChapter = currentCourse?.chapters.find((c: any) => String(c.chapter_id) === String(chapterId));
        const questions = foundChapter?.quiz?.questions ?? [];
        const isLastChapter = currentCourse?.chapters.indexOf(foundChapter) === (currentCourse?.amount_of_chapters - 1);
        // Run through every question and its correct answers
        // Check our answers, if there's at least one wrong one - user gets 0 points
        for (let i = 0; i < questions.length; i++){
            const userAnswers = answersMap.get(i + 1) ?? [];
            const correctLabels = questions[i].answers
              .filter((a: any) => a.correct === true)
              .map((a: any) => a.answer_label);

            const allCorrect =
              correctLabels.every((label: string) => userAnswers.includes(label)) &&
              userAnswers.every((label: string) => correctLabels.includes(label));

            if (allCorrect) userScore += 1;
        }
        const endScore = Math.round(userScore/totalScore*100);
        setScore(endScore);
        if (endScore < 50){
            setPassed(false);
            setResultText("Well effort.");
            setHelpText("You didn't make it this time! Give it another try.");
        }
        else{
            if (isLastChapter){
                setResultText("You've passed and completed the course!");
                setHelpText("You did well on this test! Now choose the next course you want to learn!");
            }
            else{
                setResultText("You've passed!");
                setHelpText("You did well on this test! Now choose the next course you want to learn!");
            }
        }

    }, [course])

    const nextStep = async () => {
        if (!db) return;
        
        const user = await db.general.user.findOne({
          selector: { current: {$eq: true}}
        }).exec();
        
        if (user){
            const nextChapter = user.currentChapter+1;
            
            await user.patch({
                currentChapter: nextChapter,
                currentCourseCompletedChapters: [...user.currentCourseCompletedChapters, chapterId],
            });
        }
        const currentCourse = courses.courses.find(c => String(c.course_id) === String(courseId));
        if (!currentCourse){
            return;
        } 
        const isLastChapter = currentCourse.chapters.findIndex((c: any) => String(c.chapter_id) === String(chapterId)) === (currentCourse?.amount_of_chapters-1);

        // Get back to Kurswahl if its the last chapter
        if (isLastChapter){
            if (user){
                await user.patch({
                    completedCourses: [...user.completedCourses, courseId],
                });
            }
            router.navigate("/start/Kurswahl");
        } 
        else{
            router.navigate("/Home");

        }

    } 


    return (
        <ThemedView style={styles.container}>
            <View style={styles.result}>
                <Text style={[fonts.josefin, fonts.josefinBold,]}>{resultText}</Text>
                <Text style={[fonts.josefin, fonts.josefinBold, {fontSize: 48, }]}>{score}%</Text>
                <Text style={[fonts.josefin, fonts.josefinMedium, ]}>{helpText}</Text>
            </View>
          {/* Choose a different course or just complete the chapter */}
          
          {/* Case 1: passed */}
          {passed && 
          
            <>
                <View style={styles.buttonContainer}>
                <Button
                    text="Next"
                    iconName="chevron-right"
                    light={true}
                    darkIcon={true}
                    fullWidth={true}
                    onPress={() => {
                      nextStep();
                    }}
                />
                </View>
                
                <View style={styles.buttonContainer}>
                <Button
                    text="Maybe later"
                    iconName="chevron-right"
                    light={true}
                    noIcon={true}
                    darkIcon={true}
                    fullWidth={true}
                    onPress={() => {
                      router.navigate("/Home");
                    }}
                />
                </View>

            </>
          
          }
          {/* Case 2:not passed */}
          
          {!passed &&
            <>
                <View style={styles.buttonContainer}>
                <Button
                    text="Try again"
                    iconName="chevron-right"
                    light={true}
                    noIcon={true}
                    darkIcon={true}
                    fullWidth={true}
                    onPress={() => {
                      router.push({
                        pathname: '/Quiz',
                        params: {
                            courseId: courseId,
                            chapterId: chapterId,
                        }
                      })
                    }}
                />
                </View>
            </>
          }
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    backgroundColor: colors.whiteBg.backgroundColor,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 64,
    paddingBottom: 64, 
  },
  buttonContainer: {
    height: 50,
    width: '100%',
  }
});