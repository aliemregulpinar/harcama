import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { listReceipts, removeReceipt, type ReceiptFile } from '../../src/utils/fs';

export default function ReceiptsScreen() {
  const [items, setItems] = useState<ReceiptFile[]>([]);

  async function refresh() {
    const data = await listReceipts();
    setItems(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Kayıtlı Fişler</Text>
        <Link href="/" asChild>
          <Pressable style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#111827', borderRadius: 8 }}>
            <Text style={{ color: 'white', fontWeight: '700' }}>Ana Menü</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.uri}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: 220, backgroundColor: '#000' }} />
            <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>{item.name}</Text>
              <Pressable
                onPress={async () => {
                  await removeReceipt(item.uri);
                  await refresh();
                }}
                style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#ef4444', borderRadius: 8 }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>Sil</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
