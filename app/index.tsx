import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>HarcaMa</Text>
      <Link href="/scan" asChild>
        <Pressable style={{ padding: 12, backgroundColor: "#111827", borderRadius: 10 }}>
          <Text style={{ color: "white" }}>Fiş Tara (yakında)</Text>
        </Pressable>
      </Link>
      <Link href="/receipts" asChild>
        <Pressable style={{ padding: 12, backgroundColor: "#e5e7eb", borderRadius: 10 }}>
          <Text style={{ color: "#111827" }}>Kayıtlar (yakında)</Text>
        </Pressable>
      </Link>
    </View>
  );
}
