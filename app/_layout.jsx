import { Slot, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {StatusBar} from 'expo-status-bar'
import {ClerkProvider} from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import {COLORS} from "../constants/colors.js"
import SafeScreen from '../components/SafeScreen.jsx'

export default function RootLayout() {
  return(
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot/>
      </SafeScreen>
    </ClerkProvider>
  )
}
