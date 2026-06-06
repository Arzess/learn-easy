import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import Button from '@/components/Button';
import ProgressCircle from "@/components/Circle";
import courses from "@/assets/courses.json"

export default function Bookmarks() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const db = useDB();
  
  // Destructure intensity with a safe dynamic fallback
  const { intensity } = useLocalSearchParams();
  const currentIntensity = Number(intensity) || 1;

  useEffect(() => {
    const fetchCourseId = async () => {
      if (!db) return;
      const user = await db.general.user.findOne({
        selector: { current: { $eq: true } }
      }).exec();

      if (user) {
        const course = courses.courses.find(c => String(c.course_id) === String(user.toJSON().course));
        if (course) {
          setCourseId(course.course_id);
          setCourseName(course.course_name);
        } 
      }
    };
    fetchCourseId();
  }, [db]);

  // Generate consistency array data safely
  const consistency = Array.from({ length: 30 }, (_, index) => {
    const possibleSteps = [0, 0.25, 0.5, 0.75, 1];
    const randomStep = possibleSteps[Math.floor(Math.random() * possibleSteps.length)];
    return {
      id: String(index),
      dayNumber: index + 1,
      value: randomStep * currentIntensity
    };
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <ThemedView style={styles.container}>
      {/* Title Header Section */}
      <View style={styles.titleNavigationContainer}>
        <Button 
          text="" 
          iconName="arrow-left" 
          onPress={() => { router.back() }} 
          light={true} 
          darkIcon={true} 
          fullWidth={false} 
          style={{ borderRadius: 999, width: 48, height: 48 }}
        />
        <View style={styles.titleContainer}>
          <Text style={[fonts.josefin, { color: textColor }]}>Your consistency for this month</Text>
          <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]}>Calendar</Text>
        </View>
      </View>

      {/* Grid FlatList Layer */}
      <FlatList
        data={consistency}
        keyExtractor={(item) => item.id}
        numColumns={3} // Locks layout structure to 3 uniform items per row
        columnWrapperStyle={styles.rowWrapper} 
        contentContainerStyle={styles.calendarContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const calculatedPercentage = Math.round((item.value / currentIntensity) * 100);

          return (
            <View style={styles.calendarUnit}>
              <Text style={[fonts.josefin, fonts.josefinSemi, { color: '#000', fontSize: 12 }]} numberOfLines={1}>
                {daysOfWeek[index % 7]}
              </Text>

              <ProgressCircle 
                radius={14} 
                percentage={calculatedPercentage === 0 ? 0 : calculatedPercentage} 
                color={"black"}
                strokeWidth={4}
              />

              <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[fonts.josefin, { color: '#555', fontSize: 12 }]}>May</Text>
                <Text style={[fonts.josefin, fonts.josefinSemi, { fontSize: 18, color: '#000' }]}>
                  {item.dayNumber}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  titleNavigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16, 
  },
  calendarUnit: {
    backgroundColor: "#F4F4F4",
    width: '31%',
    gap: 12,
    borderTopWidth: 4,
    borderTopColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowColor: "black",
  },
});