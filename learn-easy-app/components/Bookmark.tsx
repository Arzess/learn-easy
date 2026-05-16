import React from 'react'
import {TextInput, View, StyleSheet, Text, Image} from 'react-native'
import { fonts, colors } from "../constants/theme";
import courses from '@/assets/courses.json'

export default function Bookmark({added, content_id, courseId, url} : {added: boolean, content_id: number, courseId: string, url: string}){
  const course = courses.courses.find(b => b.course_id == courseId);
  const source = course?.chapters.flatMap(ch => ch.chapter_content).find(c => c.content_id === content_id);
  
  const imageUri = source?.image_source ?? url;
  
  if (!imageUri) return null;

    return (
        <View style={styles.bookmarkContainer}>
            <Image source={{ uri: url}} resizeMode='cover' style={styles.bookmarkImage}/>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {    
        flex: 1,
        borderRadius: 8,
        borderColor: colors.primary2.color,
        borderWidth: 1,
        padding: 8,
    },
    bookmarkContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
        maxHeight: '100%',
        width: '100%',
    },
    bookmarkImage: {
        width: '100%',
        height: '100%',
    }

})

