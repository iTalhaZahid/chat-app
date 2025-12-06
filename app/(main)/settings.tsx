import Avatar from '@/components/Avatar'
import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import React, { useEffect, useState } from 'react'
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import * as Icons from 'phosphor-react-native';
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { useAuth } from '@/context/authContext'
import { UserDataProps } from '@/types'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { updateProfile } from '@/socket/socketEvents'
import * as ImagePicker from 'expo-image-picker';
import { uploadImagetoCloudinary } from '@/services/imageService'

const Settings = () => {

    const { user, signOut, updateToken } = useAuth();
    const [userData, setUserData] = useState<UserDataProps>({
        name: '',
        email: '',
        avatar: null,
    });

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const onSubmit = async () => {
        // Handle form submission logic here
        let { name, avatar } = userData;
        if (!name.trim()) {
            Alert.alert("Validation Error", "Name cannot be empty.");
            return;
        }

        let data = {
            name,
            avatar
        };

        if (avatar && avatar?.uri) {
            setLoading(true);
            const res = await uploadImagetoCloudinary(avatar, 'profiles');
            if (res.success) {
                data.avatar = res.data;
            } else {
                Alert.alert("Error", res.msg || "Failed to upload avatar image.");
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        updateProfile(data);

    }

    // Handle logout
    const handleLogout = async () => {
        router.back();
        await signOut();
    }

    // Show logout confirmation alert
    const showLogoutAlert = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => handleLogout()
            }
        ])
    }


    // Initialize form with user data
    useEffect(() => {
        setUserData({
            name: user?.name || '',
            email: user?.email || '',
            avatar: user?.avatar || null,
        });
    }, [])


    //process update profile response
    const processupdatedProfile = (response: any) => {
        console.log("The Received Data is:", response)
        setLoading(false);
        if (response.success) {
            updateToken(response.data.token);
            Alert.alert("Success", "Profile updated successfully.");
            router.back();
        }
        else {
            Alert.alert("Error", response.message || "Failed to update profile.");
        }
    }

    // Socket event listener for profile update response
    useEffect(() => {
        updateProfile(processupdatedProfile);

        return () => {
            updateProfile(processupdatedProfile, true);
        }
    }, [])


    // Pick image from gallery
    const pickImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        console.log(result);

        if (!result.canceled) {
            // setImage(result.assets[0].uri);
            setUserData({ ...userData, avatar: result.assets[0] });
        }
    };

    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header title="Update Profile"
                    leftIcon={
                        <BackButton color={colors.black} />
                    }
                    style={{ marginVertical: spacingY._15 }}
                />
                {/* Form */}
                <ScrollView style={styles.form}>
                    <View style={styles.avatarContainer}>
                        {/* Select Avatar */}
                        <Avatar uri={userData.avatar} size={140} />
                        <TouchableOpacity onPress={pickImage}>
                            <Icons.Pencil size={verticalScale(22)} color={colors.neutral800} style={styles.editIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ gap: spacingY._20 }}>
                        <View style={styles.inputContainer}>

                            {/* Email */}

                            <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>
                            <Input
                                value={userData.email}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingLeft: spacingX._20,
                                    backgroundColor: colors.neutral300
                                }}
                                editable={false}
                                onChangeText={(value) => { setUserData({ ...userData, email: value }) }}

                            />

                            {/* Name */}
                            <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>
                            <Input
                                value={userData.name}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingLeft: spacingX._20,
                                }}
                                onChangeText={(value) => { setUserData({ ...userData, name: value }) }}
                            />

                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    !loading &&
                    (
                        <Button
                            style={{
                                backgroundColor: colors.rose,
                                height: verticalScale(56),
                                width: verticalScale(56),
                            }}
                            onPress={showLogoutAlert}
                        >
                            <Icons.SignOut size={verticalScale(30)} color={colors.white} weight='bold' />
                        </Button>
                    )
                }

                <Button
                    style={{
                        flex: 1,
                    }}
                    onPress={onSubmit}
                    loading={loading}
                >
                    <Typo color={colors.black} fontWeight='700'>Save Changes</Typo>
                </Button>
            </View>
        </ScreenWrapper>
    )
};

export default Settings

const styles = StyleSheet.create({
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        left: spacingX._30,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._10,
    },
    inputContainer: {
        gap: spacingY._7,
    },
    avatarContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(10),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral200,
        marginBottom: spacingY._10,
        borderTopWidth: 1,
        paddingHorizontal: spacingX._15,
    },
    container: {
        justifyContent: "space-between",
        flex: 1,
        paddingHorizontal: spacingX._20
    }
})