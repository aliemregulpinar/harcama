import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { listReceiptsFiles, readIndex, removeReceiptAndMeta, type ReceiptMeta } from '../../src/utils/fs';

type Row = { uri: string; name: string; mtime: number | null; meta?: ReceiptMeta };

export default function ReceiptsScreen() {
  const [items, setItems] = useState<Row[]>([]);

  async function refresh() {
    const files = await listReceiptsFiles();
    const index = await readIndex();
    const merged: Row[] = files.map(f => ({
      ...f,
      meta: index.find(m => m.uri === f.uri) || undefined,
    }));
    setItems(merged);
  }

  useEffect(() => { refresh(); }, []);

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
            <View style={{ padding: 12, gap: 6 }}>
              <Text numberOfLines={1} style={{ fontWeight: '700' }}>
                {item.meta?.store || item.name}
              </Text>
              <Text style={{ color: '#6b7280' }}>
                {item.meta?.total != null ? `Toplam: ${item.meta.total.toFixed(2)} TL • ` : ''}
                {item.mtime ? new Date(item.mtime * 1000).toLocaleString() : ''}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                <Link href={{ pathname: '/receipts/new', params: { uri: item.uri } }} asChild>
                  <Pressable style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#e5e7eb', borderRadius: 8 }}>
                    <Text style={{ color: '#111827', fontWeight: '700' }}>{item.meta ? 'Düzenle' : 'Bilgi Ekle'}</Text>
                  </Pressable>
                </Link>
                <Pressable
                  onPress={async () => { await removeReceiptAndMeta(item.uri); await refresh(); }}
                  style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#ef4444', borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Sil</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
