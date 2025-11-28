import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import "../global.css"

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  )
}

export default RootLayout();
