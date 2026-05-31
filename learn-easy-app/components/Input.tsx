import React from 'react'
import {TextInput, View, StyleSheet, Text} from 'react-native'
import { fonts, colors } from "../constants/theme";

// mit KI bearbeitet – helperText-Prop hinzugefügt für Hilfstext unter Eingabefeldern
export default function Input({color = "dark", value, placeholder, label, helperText, changeText} : {color: string, value: string, placeholder: string, label?: string, helperText?: string, changeText: Function}){
    if (!["dark", "light"].includes(color.toLowerCase())) return null;

    return (
        <View style={styles.inputContainer}>
            <Text className="input-label" style={[fonts.josefin, styles.label, (label == "" ? styles.hidden : null)]}>{label}</Text>
            <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={changeText as any}></TextInput>
            {helperText ? <Text style={[fonts.josefin, styles.helperText]}>{helperText}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 44,
        borderRadius: 8,
        borderColor: colors.primary2.color,
        borderWidth: 1,
        padding: 8,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    label: {
        fontSize: 14,
    },
    helperText: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    hidden: {
        display: 'none',
    }

})

