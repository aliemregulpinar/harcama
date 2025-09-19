import { useRef, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { saveReceiptPhotoFromUri } from '../../src/utils/fs';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const camRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>Kamera iznine ihtiyacımız var</Text>
        <Pressable onPress={requestPermission} style={{ padding: 12, backgroundColor: '#111827', borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>İzin Ver</Text>
        </Pressable>
      </View>
    );
  }

  async function take() {
    if (!ready || !camRef.current) return;
    try {
      const photo = await (camRef.current as any).takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });
      if (photo?.uri) setPreviewUri(photo.uri);
    } catch (e) {
      console.warn('takePicture error', e);
    }
  }

  async function save() {
    if (!previewUri || saving) return;
    setSaving(true);
    try {
      await saveReceiptPhotoFromUri(previewUri);
      setPreviewUri(null);
      router.push('/receipts');
    } catch (e) {
      console.warn('save error', e);
    } finally {
      setSaving(false);
    }
  }

  if (previewUri) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image source={{ uri: previewUri }} style={{ flex: 1, resizeMode: 'contain' }} />
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
          <Pressable onPress={() => setPreviewUri(null)} style={{ padding: 14, backgroundColor: '#e5e7eb', borderRadius: 12 }}>
            <Text style={{ fontWeight: '700', color: '#111827' }}>Tekrar Çek</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={save} style={{ padding: 14, backgroundColor: '#10b981', borderRadius: 12, opacity: saving ? 0.6 : 1 }}>
            <Text style={{ fontWeight: '700', color: 'white' }}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={camRef as any}
        onCameraReady={() => setReady(true)}
        style={{ flex: 1 }}
        facing={facing}
      />
      <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', gap: 12 }}>
        <Pressable onPress={take} style={{ paddingVertical: 14, paddingHorizontal: 24, backgroundColor: '#111827', borderRadius: 9999 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Çek</Text>
        </Pressable>
        <Pressable onPress={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))} style={{ padding: 10, backgroundColor: '#e5e7eb', borderRadius: 8 }}>
          <Text style={{ color: '#111827', fontWeight: '600' }}>Ön/Arka</Text>
        </Pressable>
      </View>
    </View>
  );
}
