import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { upsertMeta, type ReceiptMeta } from '../../src/utils/fs';

export default function NewReceiptScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const router = useRouter();

  const [store, setStore] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uri) {
      Alert.alert('Hata', 'Fotoğraf bulunamadı');
      router.replace('/scan');
    }
  }, [uri]);

  async function saveMeta() {
    if (!uri) return;
    setLoading(true);
    try {
      const id = 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
      const meta: ReceiptMeta = {
        id,
        uri,
        fileName: uri.split('/').pop() || 'receipt.jpg',
        createdAt: Date.now(),
        store: store.trim() || undefined,
        total: total ? Number(total.replace(',', '.')) : undefined,
      };
      await upsertMeta(meta);
      router.replace('/receipts');
    } catch (e) {
      Alert.alert('Kaydetme hatası', String(e));
    } finally {
      setLoading(false);
    }
  }

  if (!uri) return null;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Image source={{ uri }} style={{ width: '100%', height: 240, backgroundColor: '#000', borderRadius: 12 }} />
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '700' }}>Mağaza Adı</Text>
        <TextInput
          value={store}
          onChangeText={setStore}
          placeholder="Örn: Migros"
          style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10 }}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '700' }}>Toplam (TL)</Text>
        <TextInput
          value={total}
          onChangeText={setTotal}
          placeholder="Örn: 123,45"
          keyboardType="decimal-pad"
          style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10 }}
        />
      </View>

      <Pressable disabled={loading} onPress={saveMeta} style={{ marginTop: 8, padding: 14, backgroundColor: '#111827', borderRadius: 12, opacity: loading ? 0.6 : 1 }}>
        <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>{loading ? 'Kaydediliyor…' : 'Kaydet'}</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', marginTop: 8 }}>
        <Text style={{ textAlign: 'center' }}>Vazgeç</Text>
      </Pressable>
    </View>
  );
}
