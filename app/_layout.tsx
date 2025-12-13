import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import "../global.css"
import { StatusBar } from 'expo-status-bar';
const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(main)/home" />
      <Stack.Screen name="(main)/newConversationModal" options={{ presentation: "modal" }} />
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <StackLayout />
    </AuthProvider>
  )
}

export default RootLayout;
