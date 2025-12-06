import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import "../global.css"

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
      <StackLayout />
    </AuthProvider>
  )
}

export default RootLayout;
