import { StyleSheet, View, Text, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors } from '@/constants/theme';
import { useDB } from '@/db/DatabaseContext';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import courses from "@/assets/courses.json"

export default function Bookmarks() {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const db = useDB();

  useEffect(()=>{

  const fetchCourseId = async () => {
    if (!db) return;

    const user = await db.general.user.findOne({
      selector: { current: {$eq: true}}
    }).exec();

    if (user){
      const course = courses.courses.find(c => String(c.course_id) === String(user.toJSON().course));
      if (course){
        setCourseId(course.course_id)
      } 
    }
  }

  fetchCourseId();


  }, [db])


  return (
      <ThemedView style={styles.container}>
         <View style={styles.titleContainer}>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, colors.white]} className="heading">Bookmarks</Text>
            <Text style={[fonts.josefin, colors.white]}>Browse through your saved content</Text>
          </View>

          <View style={styles.categories}>
            <Card subtext="Category" text="Pictures" onPress={()=>{
              router.push({
                pathname: "/bookmarks/Pictures",
                params: {
                  courseId: courseId, 
                },
              });
            }}/>
            <Card subtext="Category" text="Videos" onPress={()=>{
              router.navigate("/bookmarks/Videos")
            }}/>
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
  categories: {
    display: 'flex',
    gap: 16,
  }
});