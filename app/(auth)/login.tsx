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
import { useAuth } from '@/context/authContext'

const LoginIn = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }
    try {
       setIsLoading(true);
       await signIn(emailRef.current, passwordRef.current);
      // Perform Signin Logic Here
    } catch (error:any) {
       Alert.alert("Login", error.message || "Something went wrong");
    }
    finally{
      setIsLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
      <ScreenWrapper>
        <View className='flex-1 justify-between'>
          
          {/* Header Section */}

          <View style={styles.header}>
            <BackButton iconSize={28} />
            <Typo size={17} color={colors.white}>Forgot your Password?</Typo>
          </View>
          <View style={styles.content}>
            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight={'600'}>Welcome Back</Typo>
                <Typo color={colors.neutral600}>Login to continue chatting</Typo>
              </View>

              {/* Email Input */}

              <Input placeholder='Enter Your Email' onChangeText={(value: string) => emailRef.current = value} icon={<Icons.At size={verticalScale(26)} color={colors.neutral600} />} />

              {/*  Password Input */}

              <Input placeholder='Enter Your Password' onChangeText={(value: string) => passwordRef.current = value} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral600} />} secureTextEntry />

              {/* Login Button */}

              <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo fontWeight='bold' size={20} color={colors.black}>Login</Typo>
                </Button>
              </View>

              <View className='flex-row justify-center items-center gap-1'>
                <Typo>Don't have an account?</Typo>
                <Pressable onPress={() => router.replace("/(auth)/register")}><Typo color={colors.primaryDark}>Sign Up</Typo></Pressable>
              </View>

            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  )
}

export default LoginIn

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