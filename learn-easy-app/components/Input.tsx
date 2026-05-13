import React from 'react'
import {TextInput, View, StyleSheet, Text} from 'react-native'
import { fonts, colors } from "../constants/theme";

export default function Input({color = "dark", value, placeholder, label, changeText} : {color: string, value: string, placeholder: string, label?: string, changeText: Function}){
    if (!["dark", "light"].includes(color.toLowerCase())) return null;
    
    return (
        <View style={styles.inputContainer}>
            <Text className="input-label" style={[fonts.josefin, styles.label, (label == "" ? styles.hidden : null)]}>{label}</Text>
            <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={changeText as any}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {    
        flex: 1,
        borderRadius: 8,
        borderColor: colors.primary2.color,
        borderWidth: 1,
        padding: 12,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontSize: 14,
    },
    hidden: {
        display: 'none',
    }

})

