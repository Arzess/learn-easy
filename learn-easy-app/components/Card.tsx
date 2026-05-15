import React from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import { fonts, colors} from '@/constants/theme'
import SVG from './svg'
import './svg-sheet'


export default function Card({subtext, text, onPress, selected} : {subtext: string, text: string, onPress: Function, selected?: boolean}){
    return (
        <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress as any}>
            <Text style={[fonts.josefin, styles.cardSmallText, selected && styles.cardSelectedText]}>{subtext}</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium, selected && styles.cardSelectedText]}>{text}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.whiteBg.backgroundColor,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        gap: 0,
        height: 128,
        minHeight: 128,
        width: '100%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFF0',
    },
    cardSmallText: {
        fontSize: 10,
    },
    cardText: {
        fontSize: 14,
    },
    cardSelected: {
        backgroundColor: colors.blackBg.backgroundColor,
    },
    cardSelectedText: {
        color: colors.white.color,
    },

})


