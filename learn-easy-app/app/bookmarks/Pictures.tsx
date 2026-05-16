import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Bookmark from '@/components/Bookmark';
import { useDB } from '@/db/DatabaseContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import NothingFound from '@/components/NothingFound';


export default function Bookmarks() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const db = useDB();
  type Bookmark = {
  bookmarkId: string;
  inhaltsTyp: string;
  inhaltsId: number;
  };
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [noResults, setNoResults] = useState(false);
  // Fetch bookmarks
  useEffect(()=>{
    
    const fetchBookmarks = async (type: string) => {

      if (!db) return;
      const res = await db.general.bookmarks.find({
        selector: { inhaltsTyp: {$eq: type}}
      }).exec();

      const results = res.map((b: any) => b.toJSON());
      setBookmarks(results);
      if (results.length === 0) setNoResults(true);
    }

    fetchBookmarks("image");
  }, [db])


  return (
      <ThemedView style={styles.container}>
        <View style={styles.titleNavigationContainer}>
            <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
            <View style={styles.titleContainer}>
                <Text style={[fonts.josefin, colors.white]}>Bookmarks</Text>
                <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, colors.white]} className="heading">Pictures</Text>
            </View>
        </View>
        {/* Bookmarks */}
        {/* Case 1: available results */}
        {
        
        !noResults && 
        
        <>
          <FlatList data={bookmarks} keyExtractor={item => item.bookmarkId.toString()}
            renderItem={({ item }) => (
              <Bookmark added={true} content_id={item.inhaltsId} courseId={courseId}/>
            )}  
          />
        </>
        
        }

        {/* Case 2: no results */}
        {
        
        noResults && 
        
        <>
          <NothingFound text="You don’t have any pictures saved yet. Click on the bookmark icon to add your favorite content here."/>
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
    gap: 8,
  }
});