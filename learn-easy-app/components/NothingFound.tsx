import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import { fonts, colors} from '@/constants/theme'


export default function NothingFound({text} : {text: string}){
    return (
        <View style={styles.nothingFoundContainer}>
            <Text style={[fonts.josefin, fonts.josefinBold, {color: colors.white.color}]}>Oops..</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.mainHeading, {color: colors.white.color}]}>We couldn’t find anything here.</Text>
            <Text style={[fonts.josefin, {textAlign: 'center', color: colors.white.color}]}>{text}</Text>
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


