import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDB } from '@/db/DatabaseContext';
import { createClient } from 'pexels';
import courses from '@/assets/courses.json';
import { colors, fonts } from '@/constants/theme';
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";


const width = Dimensions.get('window').width;
const carouselWidth = width - 32;

export default function Home() {
  const theme = useColorScheme();
  const db = useDB();
  const [userData, setUserData] = useState<any>(null);
  const [pictures, setPictures] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // Fetch random related pictures
  const fetchPictures = async () => {
    try{
      const client = createClient('dnXMyimAOpRQXMPQe1Vr6TsayuxePRRb7Ox3hY9NOpMpTp0kt8VlOqb7');
      const query = courses.courses[0].course_name;

      const res = await client.photos.search({ query, per_page: 2 });
      if ('photos' in res){
       const pictures = res.photos.map((pic : any) => ({
        source: {uri: pic.src.large},
        }));
        let nothingFound = pictures.length === 0;
        setPictures(pictures as any);
        setNoResult(nothingFound);
        
      }
    }
    catch (e) {
      setNoResult(true);
      console.log(`There was an error while fetching random pictures: ${e}`)

    }
    
  }


  // Fetch the user data
  useEffect(()=>{
    const fetchUser = async () => {
      if (!db) return;

      // @ts-ignore
      const user = await db.general.user.findOne({
        selector: { current: {$eq: true}}
      }).exec();

      if (user) setUserData(user.toJSON())

    };



    fetchUser();
    fetchPictures();

  }, [db]);


  const isDark = theme === 'dark';



  return (
      
      <ThemedView style={styles.container}>
        <View>
          <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading, colors.white]} className="heading">Willkommen zurück!</Text>
        </View>
        {/* Progress */}
        {/* Gallery */}
        <View style={{ height: 250 }}>
          <>

             <Carousel
               ref={ref}
               autoPlay={true}
               autoPlayInterval={4000}
               data={pictures}
               width={carouselWidth}
               height={220}
               loop={true}
               pagingEnabled={true}
               snapEnabled={true}
               mode={"horizontal-stack"}
               modeConfig={{
                  snapDirection: "left",
                  stackInterval: 30,
                  scaleInterval: 0.08,
                  opacityInterval: 0.1
               }}
               onProgressChange={progress}
               renderItem={({ item }: { item: any }) => (
                 <View style={styles.carouselItem}>
                   <Image 
                     source={item.source} 
                     style={styles.image} 
                     resizeMode="cover" 
                   />
                 </View>
               )}
             />

          </>
      </View>
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    flex: 1,
    padding: 16,
  },
  carouselItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee'
  },
  image: {
    width: '100%',
    height: '100%',
  }
});