import { StyleSheet, View, Text, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Button from '@/components/Button';
import { useDB } from '@/db/DatabaseContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Card from '@/components/Card';
import courses from "@/assets/courses.json"

export default function Quiz() {
    const theme = useColorScheme();
    const textColor = Colors[theme].text;
    const router = useRouter();
    const { courseId } = useLocalSearchParams<{courseId: string}>();
    const [course, setCourse] = useState<any>(null);

    const db = useDB(); 
    useEffect(()=>{ 
        const fetchCourseInfo = async () => {
            const foundCourse = courses.courses.find(c => String(c.course_id) === String(courseId));
            if (foundCourse){
              setCourse(foundCourse);
            } 
        }
      fetchCourseInfo();
    }, []);
    // To-do: instantiate a map that will be passed to quiz result page for assessment


    return (
        <ThemedView style={styles.container}>
           <View style={styles.titleContainer}>
              <Text style={[fonts.josefin, { color: textColor }]}>Quiz</Text>
              <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]} className="heading">{course?.course_name}</Text>
            </View>
            {/* Quiz content */}
            {/* <FlatList/> */}

            {/* Submit button */}
            <View style={styles.buttonContainer}>
                <Button text="Check the answers" onPress={()=>{
                    // To-do:
                    // Check the answers
                }} iconName='chevron-right' light={true} darkIcon={true} fullWidth={true}/>
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
  buttonContainer: {
    height: 50,
  }
});