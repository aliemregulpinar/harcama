// app/_layout.tsx
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerTitle: 'HarcaMa' }}>
        <Stack.Screen name="index" options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="scan/index" options={{ title: 'Fiş Tara' }} />
        <Stack.Screen name="receipts/index" options={{ title: 'Kayıtlı Fişler' }} />
        <Stack.Screen name="receipts/new" options={{ title: 'Yeni Fiş' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Bulunamadı' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
