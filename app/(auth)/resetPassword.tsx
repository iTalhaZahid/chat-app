import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Input from '@/components/Input'
import { verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext'
import { resetPassword } from '../../services/authService'

const ResetPassword = () => {
    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleResetPassword = async () => {
        if (!emailRef.current) {
            Alert.alert("Reset Password", "Please enter your email");
            return;
        }
        try {
            setIsLoading(true);
            await resetPassword(emailRef.current);
            router.push({
                pathname: "/(auth)/otpScreen",
                params: { email: emailRef.current, flow: 'resetPassword' }
            });
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "height"}>
            <ScreenWrapper>
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <BackButton iconSize={28} />
                        <Typo size={17} color={colors.white}>Reset Your Password </Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={'600'}>Forgot Your Password?</Typo>
                                <Typo color={colors.neutral600}>Don't worry we got you. You can reset your password here. Just enter your email and leave the rest to us.</Typo>
                            </View>

                            {/* Email Input */}

                            <Input placeholder='Enter Your Email' onChangeText={(value: string) => emailRef.current = value} icon={<Icons.At size={verticalScale(26)} color={colors.neutral600} />} />

                            {/* Reset Password Button */}

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleResetPassword}>
                                    <Typo fontWeight='bold' size={20} color={colors.black}>Reset Password</Typo>
                                </Button>
                            </View>



                        </ScrollView>
                    </View>

                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView >

    )
}

export default ResetPassword

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