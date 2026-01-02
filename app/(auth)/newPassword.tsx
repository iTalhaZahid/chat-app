import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling'
import Input from '@/components/Input'
import { newPassword } from '@/services/authService'

const NewScreen = () => {
    const { resetToken } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");

    const handleNewPassword = async () => {
        try {
            setIsLoading(true);
            if (passwordRef.current !== confirmPasswordRef.current) {
                Alert.alert("Reset Password", "Passwords do not match");
                return;
            }
            if (passwordRef.current.length < 8) {
                Alert.alert("Reset Password", "Password must be at least 8 characters long");
                return;
            }
            let res = await newPassword(resetToken as string, passwordRef.current);
            if (res.success) {
                Alert.alert("Reset Password", "Password reset successfully. You can now login with your new password.");
                router.replace('/(auth)/login');
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
                        <Typo size={17} color={colors.white}>Reset Password</Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._5, marginBottom: spacingY._15 }}>
                                <Typo size={28} fontWeight={'600'}>Reset your Password</Typo>
                                <Typo color={colors.neutral600}>Enter your new password to continue chatting.</Typo>
                            </View>

                            {/* New Password Input */}
                            <Input placeholder='New Password' onChangeText={(value: string) => passwordRef.current = value} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral600} />} secureTextEntry />
                            {/* Confirm New Password Input */}
                            <Input placeholder='Confirm New Password' onChangeText={(value: string) => confirmPasswordRef.current = value} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral600} />} secureTextEntry />


                            {/* Reset Password Button */}
                            <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                                <Button loading={isLoading} onPress={handleNewPassword}>
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

export default NewScreen

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