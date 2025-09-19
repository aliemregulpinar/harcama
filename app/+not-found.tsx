import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Sayfa bulunamadı</Text>
      <Link href="/" asChild>
        <Pressable style={{ padding: 10, backgroundColor: "#111827", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>Ana sayfaya dön</Text>
        </Pressable>
      </Link>
    </View>
  );
}
