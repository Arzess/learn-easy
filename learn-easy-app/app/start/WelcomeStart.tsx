import { StyleSheet, View, Text, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import {fonts, colors} from '@/constants/theme'
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';


export default function Start() {
  const router = useRouter();

  return (
      
      <ThemedView style={styles.container}>
        <View className="image-container" style={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'row',}}>
          <Image source={require("@/assets/images/logo.png")}/>
        </View>
        <View style={{display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[fonts.josefin, fonts.josefinMedium, styles.heading]} className="heading">Hey!</Text>
            <Text style={[fonts.josefin, {textAlign: 'center'}]}>We are Learn Easy. We are educational app to help you learn more about general knowledge topics.</Text>
            <Text style={[fonts.josefin, {textAlign: 'center'}]}>Are you ready to embark on your learning jorney?</Text>
        </View>
        <Button text="Create an account" iconName="chevron-right" darkIcon={false} fullWidth={false} onPress={()=>{router.navigate("/start/Start")}}/>
         
      </ThemedView>
      
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
  },
  subheading: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    gap: 24,
    display: 'flex',
    padding: 16,
    paddingTop: 64,
    paddingBottom: 32,
    backgroundColor: colors.whiteBg.backgroundColor,
    justifyContent: 'center',
    alignContent: 'center',
  }


});