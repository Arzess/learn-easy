import { StyleSheet, View, Text, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Card from '@/components/Card';
import courses from "@/assets/courses.json"

export default function Bookmarks() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
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
        setCourseId(course.course_id);
        setCourseName(course.course_name);
      } 
    }
  }

  fetchCourseId();


  }, [db])


  return (
      <ThemedView style={styles.container}>
         <View style={styles.titleNavigationContainer}>
                <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
                <View style={styles.titleContainer}>
                    <Text style={[fonts.josefin, { color: textColor }]}>Bookmarks</Text>
                    <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]} className="heading">{courseName}</Text>
                </View>
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
              router.push({
                pathname: "/bookmarks/Videos",
                params: {
                  courseId: courseId,
                },
              });
            }}/>
            <Card subtext="Category" text="Text" onPress={()=>{
              router.push({
                pathname: "/bookmarks/Texts",
                params: {
                  courseId: courseId,
                },
              });
            }}/>
            <Card subtext="Category" text="Texts" onPress={()=>{
              router.push({
                pathname: "/bookmarks/Texts",
                params: {
                  courseId: courseId, 
                },
              });
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
  },
    titleNavigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
});
