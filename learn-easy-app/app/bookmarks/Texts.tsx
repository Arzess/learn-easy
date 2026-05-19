import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Bookmark from '@/components/Bookmark';
import { useDB } from '@/db/DatabaseContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import NothingFound from '@/components/NothingFound';
import Svg from '@/components/svg';
import { removeBookmark } from '@/db/database';



export default function Bookmarks() {
  const theme = useColorScheme();
  const textColor = Colors[theme].text;
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const db = useDB();
  type Bookmark = {
  bookmarkId: string;
  inhaltsTyp: string;
  inhaltsId: number;
  url: string;
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

    fetchBookmarks("text");
  }, [db])




  return (
      <ThemedView style={styles.container}>
        <View style={styles.titleNavigationContainer}>
            <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
            <View style={styles.titleContainer}>
                <Text style={[fonts.josefin, { color: textColor }]}>Bookmarks</Text>
                <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]} className="heading">Texts</Text>
            </View>
        </View>
        {/* Bookmarks */}
        {/* Case 1: available results */}
        {
        
        !noResults && 
        
        <>
          <FlatList data={bookmarks} keyExtractor={item => item.bookmarkId.toString()}
            renderItem={({ item }) => (
              <View style={styles.bookmarkContainer}>
                <Bookmark added={true} content_id={item.inhaltsId} isText={true} courseId={courseId} url={item.url}/>
                <TouchableOpacity
                                  style={[
                                    styles.bookmark,
                                    {
                                      backgroundColor: colors.whiteBg.backgroundColor,
                                    }
                                  ]}
                                  onPress={() => {
                                    removeBookmark(db, item.bookmarkId);
                                    setBookmarks(prev => {
                                      const updated = prev.filter(b => b.bookmarkId !== item.bookmarkId);
                                      if (updated.length === 0) setNoResults(true);
                                      return updated;
                                    });
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Svg icon="bookmark-remove" width={16} height={16} white={true} />
                  </TouchableOpacity>
              </View>
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
  bookmarkContainer: {
    width: '100%',
    minHeight: 200,
    backgroundColor: colors.whiteBg.backgroundColor,
    borderRadius: 16,
    padding: 16,
    paddingTop: 64,
    overflow: 'hidden',
  },
  bookmark: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    zIndex: 5,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  }
});