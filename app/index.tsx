import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {  StatusBar, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();
  useEffect(()=>{
     const timeout= setTimeout(()=>{
      router.replace("/(auth)/welcome");
    },1500)
    return ()=>{clearTimeout(timeout)};
  },[])
  return (
    <View className="flex-1 justify-center items-center bg-neutral-900" >
      <StatusBar barStyle={'light-content'} backgroundColor={colors.neutral900}/>
      <Animated.Image
      source={require('../assets/images/splashImage.png')}
      entering={FadeInDown.duration(700).springify()}
      resizeMode="contain"
      className="h-[23%] aspect-square"
      />
    </View>
  );
}
