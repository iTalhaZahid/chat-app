import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'
import Button from '@/components/Button'

const WelcomeScreen = () => {
  return (
    <ScreenWrapper showPattern={true}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Typo color={colors.white} size={43} fontWeight={'900'}>ChatX</Typo>
        </View>
        <Animated.Image
        entering={FadeIn.duration(700).springify()}
        source={require('../../assets/images/welcome.png')}
        style={styles.welcomeImage}
        resizeMode='contain'
        />
        <View>
          <Typo color={colors.white} size={33} fontWeight={'800'} >Connect with your Friends and Family easily.</Typo>
        </View>
        <Button >
          <Typo size={23} fontWeight={'bold'} >Get Started</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
    marginVertical: spacingY._25,
  },
  background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: 'center'
  }
})