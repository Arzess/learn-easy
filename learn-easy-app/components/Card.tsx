import React from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import { fonts, colors} from '@/constants/theme'
import SVG from './svg'
import './svg-sheet'


// Wiederverwendbare Auswahlkarte.
// Wird im Onboarding (Rolle, Intensität) und in der Library-Übersicht verwendet.
// Bei "selected=true" wechselt sie zu schwarzem Hintergrund mit weißem Text.
// Props: subtext = kleine Beschriftung oben, text = Haupttitel, selected = ausgewählt, onPress = Callback
export default function Card({subtext, text, onPress, selected} : {subtext: string, text: string, onPress: Function, selected?: boolean}){
    return (
        <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress as any}>
            <Text style={[fonts.josefin, styles.cardSmallText, selected && styles.cardSelectedText]}>{subtext}</Text>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.cardText, selected && styles.cardSelectedText]}>{text}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.whiteBg.backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFF0',
    },
    cardSmallText: {
        fontSize: 12,
    },
    cardText: {
        fontSize: 16,
    },
    cardSelected: {
        backgroundColor: colors.blackBg.backgroundColor,
    },
    cardSelectedText: {
        color: colors.white.color,
    },

})


