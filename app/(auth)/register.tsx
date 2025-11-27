import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import Button from '@/components/Button'

const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async () => {
    if(!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    setIsLoading(true);
    // Perform Registration Logic Here
    // setIsLoading(false);

  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
      <ScreenWrapper>
        <View className='flex-1 justify-between'>
          <View style={styles.header}>
            <BackButton iconSize={28} />
            <Typo size={17} color={colors.white}>Need Some Help?</Typo>
          </View>
          <View style={styles.content}>
            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight={'600'}>Getting Started</Typo>
                <Typo color={colors.neutral600}>Create an account to continue</Typo>
              </View>

              {/* UserName Input */}

              <Input placeholder='Enter Your Name' onChangeText={(value: string) => nameRef.current = value} icon={<Icons.User size={verticalScale(26)} color={colors.neutral600} />} />

              {/* Email Input */}

              <Input placeholder='Enter Your Email' onChangeText={(value: string) => emailRef.current = value} icon={<Icons.At size={verticalScale(26)} color={colors.neutral600} />} />

              {/*  Password Input */}

              <Input placeholder='Enter Your Password' onChangeText={(value: string) => passwordRef.current = value} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral600} />} secureTextEntry />

              {/* SignUp Button */}

              <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo fontWeight='bold' size={20} color={colors.black}>Create an Account</Typo>
                </Button>
              </View>

              <View className='flex-row justify-center items-center gap-1'>
                  <Typo>Already have an account?</Typo>
                  <Pressable onPress={()=>router.replace("/(auth)/login")}><Typo color={colors.primaryDark}>Sign In</Typo></Pressable>
              </View>

            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  )
}

export default Register

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    flexDirection: 'row',
  }
})