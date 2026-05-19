import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedView } from '@/components/themed-view';
import { fonts, colors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useDB } from '@/db/DatabaseContext';
import Button from '@/components/Button';
import NothingFound from '@/components/NothingFound';
import Svg from '@/components/svg';
import { removeBookmark } from '@/db/database';
import courses from '@/assets/courses.json';



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
  // Problem: Bilder aus Kapiteln wurden in Bookmarks nicht angezeigt (useEffect wurde nicht erneut ausgeführt) – mit KI behoben
  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      const fetch = async () => {
        const res = await db.general.bookmarks.find().exec();
        const all = res.map((b: any) => b.toJSON());
        const results = all.filter((b: any) => b.inhaltsTyp === 'image');
        setBookmarks(results);
        setNoResults(results.length === 0);
      };
      fetch();
    }, [db])
  );




  return (
      <ThemedView style={styles.container}>
        <View style={styles.titleNavigationContainer}>
            <Button text="" iconName="arrow-left" onPress={()=>{router.back()}} light={true} darkIcon={true} fullWidth={false} style={{ borderRadius: 999, width: 48, height: 48,}}/>
            <View style={styles.titleContainer}>
                <Text style={[fonts.josefin, { color: textColor }]}>Bookmarks</Text>
                <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, { color: textColor }]} className="heading">Pictures</Text>
            </View>
        </View>
        {/* Bookmarks */}
        {/* Case 1: available results */}
        {
        
        !noResults && 
        
        <>
          <FlatList data={bookmarks} style={{flex: 1}} ItemSeparatorComponent={()=>(<View style={{height: 16}}></View>)} keyExtractor={item => item.bookmarkId.toString()}
            renderItem={({ item }) => (
              <View style={styles.bookmarkContainer}>
                <Bookmark added={true} content_id={item.inhaltsId} courseId={courseId} url={item.url}/>
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
              );
            }}
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
    height: 260,
    backgroundColor: colors.whiteBg.backgroundColor,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bookmark: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    zIndex: 5,
    height: 32,
    borderRadius: 8,
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