import { StyleSheet, Text, View } from 'react-native'
import React, { use } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/context/authContext'

const Home = () => {
    const {user}=useAuth();
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})