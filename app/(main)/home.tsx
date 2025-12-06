import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/context/authContext'
import Button from '@/components/Button'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import * as Icons from 'phosphor-react-native';
import { useRouter } from 'expo-router'

const Home = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
  }
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.neutral200} size={19} textProps={{ numberOfLines: 1 }}>
              Welcome back,{" "}
              <Typo color={colors.white} size={20} fontWeight={'800'}>
                {user?.name}
              </Typo>
            </Typo>
          </View>
          <TouchableOpacity style={styles.settingIcon} onPress={() => router.push('/(main)/settings')}>
            <Icons.GearSix color={colors.white} size={verticalScale(22)} weight='fill' />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>

        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  tabs: {
    flexDirection: 'row',
    gap: spacingX._10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    gap: spacingX._15,
    alignItems: 'center',
    paddingHorizontal: spacingX._10,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: 'continuous',
    overflow: 'hidden',
    paddingHorizontal: spacingX._20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  }


})