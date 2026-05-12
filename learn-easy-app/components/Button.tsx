import React from 'react'
import {Pressable, StyleSheet, Text} from 'react-native'
import { fonts, colors} from '@/constants/theme'
import SVG from './svg'
import './svg-sheet'


export default function Button({text, iconName, onPress} : {text: string, iconName: string, onPress: Function}){
    return (
        <Pressable style={styles.button} onPress={onPress as any}>
            <Text style={[fonts.josefin, styles.buttonText]}>{text}</Text>
            <SVG icon={iconName} width={24} height={24} white={true}/>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.blackBg.backgroundColor, 
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    buttonText: {
        color: 'white',
    }

})


