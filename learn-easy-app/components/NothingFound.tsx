import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import { fonts, Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'


// Problem: Texte waren im Light Mode unsichtbar (hardcodierte weiße Farbe) – mit KI behoben
export default function NothingFound({text} : {text: string}){
    const theme = useColorScheme();
    const textColor = Colors[theme].text;
    return (
        <View style={styles.nothingFoundContainer}>
            <Text style={[fonts.josefin, fonts.josefinBold, {color: textColor}]}>Oops..</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.mainHeading, {color: textColor}]}>We couldn't find anything here.</Text>
            <Text style={[fonts.josefin, {textAlign: 'center', color: textColor}]}>{text}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    nothingFoundContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainHeading: {
        fontSize: 36,
        textAlign: 'center',
    }
})
