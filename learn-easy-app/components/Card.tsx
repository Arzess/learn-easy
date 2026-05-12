import React from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import { fonts, colors} from '@/constants/theme'
import SVG from './svg'
import './svg-sheet'


export default function Button({text, onPress} : {text: string, iconName: string, onPress: Function}){
    return (
        <Pressable style={styles.card} onPress={onPress as any}>
            <Text style={[fonts.josefin, styles.cardSmallText]}>ich bin ein(e)</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium]}>{text}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.whiteBg.backgroundColor, 
        width: '50%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        gap: 0,
        height: 128,
    },
    cardSmallText: {
        fontSize: 10,
    },
    cardText: {
        fontSize: 14,
    }

})


