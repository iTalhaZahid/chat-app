import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { use, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { OtpInput } from "react-native-otp-entry";
import { verifyOTP, verifyRegisterOTP } from '@/services/authService'
import { useAuth } from '@/context/authContext'
type flow = 'register' | 'resetPassword';

const OTPScreen = () => {
    const { email, flow } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const {updateToken}=useAuth();

    const handleOTPVerification = async () => {
        try {
            setIsLoading(true);
            if (flow === 'register') {
                let response = await verifyRegisterOTP(email as string, otp);
                if (!response.success) {
                    Alert.alert("OTP Verification", "Invalid OTP. Please try again.");
                    return;
                }
                await updateToken(response.token);
                router.replace('/(main)/home');
            }
            if (flow === 'resetPassword') {
                let res = await verifyOTP(email as string, otp);
                if (!res.success) {
                    Alert.alert("OTP Verification", "Invalid OTP. Please try again.");
                    return;
                }
                router.push({
                    pathname: "/(auth)/newPassword",
                    params: { resetToken: res.resetToken }
                });
            }

        } catch (error) {
            console.log(error)
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
                        <Typo size={17} color={colors.white}>OTP Verification </Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._5, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={'600'}>Verify OTP</Typo>
                                <Typo color={colors.neutral600}>To ensure that{' '}
                                    <Typo fontWeight='bold' color={colors.black}>
                                        {email} {''}
                                    </Typo>
                                    <Typo color={colors.neutral600}>really belongs to you, please enter the OTP sent to your email.</Typo>
                                </Typo>
                            </View>

                            {/* OTP Input */}
                            <OtpInput numberOfDigits={6} onTextChange={(text) => setOtp(text)}
                                autoFocus={true}
                                type='numeric'
                                theme={{
                                    pinCodeContainerStyle: styles.pinCodeContainerStyle,
                                    focusedPinCodeContainerStyle: { borderColor: colors.primaryDark }
                                }}
                            />


                            {/* Verify OTP Button */}

                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleOTPVerification}>
                                    <Typo fontWeight='bold' size={20} color={colors.black}>Verify OTP</Typo>
                                </Button>
                            </View>



                        </ScrollView>
                    </View>

                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView >

    )
}

export default OTPScreen

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
    },
    pinCodeContainerStyle: {
        borderColor: colors.primaryLight,
    }
})