import React from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import { StyleProp, ViewStyle } from 'react-native'
import { fonts, colors} from '@/constants/theme'
import SVG from './svg'
import './svg-sheet'


export default function Button({text, iconName, onPress, light, darkIcon, style, fullWidth, noIcon} : {text: string, iconName: string, onPress: Function, light?: boolean, darkIcon: boolean, style?: StyleProp<ViewStyle>, fullWidth: boolean, noIcon?: boolean}){
    return (
        <Pressable style={[styles.button, style, light && styles.lightButton, fullWidth && styles.fullWidth]} onPress={onPress as any}>
            <Text style={[fonts.josefin, styles.buttonText, light && styles.lightButtonText]}>{text}</Text>
            {!noIcon && <SVG icon={iconName} width={24} height={24} white={!darkIcon}/>}
        </Pressable>
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.blackBg.backgroundColor, 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 12,
        borderRadius: 16,
    },
    buttonText: {
        color: 'white',
    },
    lightButton: {
        backgroundColor: colors.whiteBg.backgroundColor,
    },
    lightButtonText: {
        color: colors.black.color,
    },
    fullWidth: {
        flex: 1,
    }

})


