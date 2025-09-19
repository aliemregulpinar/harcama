// src/utils/fs.ts
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

function slash(s: string) {
  return s.endsWith('/') ? s : s + '/';
}

const base = slash(
  (FileSystem.documentDirectory ??
    FileSystem.cacheDirectory ??
    (Platform.OS === 'web' ? '/' : 'file:///')) as string
);

export const receiptsDir = base + 'receipts/';

export async function ensureReceiptsDir() {
  const info = await FileSystem.getInfoAsync(receiptsDir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
  }
  return receiptsDir;
}

export async function saveReceiptPhotoFromUri(srcUri: string) {
  await ensureReceiptsDir();
  const name = `receipt_${Date.now()}.jpg`;
  const dest = receiptsDir + name;

  try {
    await FileSystem.moveAsync({ from: srcUri, to: dest });
  } catch {
    await FileSystem.copyAsync({ from: srcUri, to: dest });
    try {
      await FileSystem.deleteAsync(srcUri, { idempotent: true });
    } catch {}
  }
  return dest;
}

export type ReceiptFile = {
  uri: string;
  name: string;
  size: number | null;
  mtime: number | null;
};

export async function listReceipts(): Promise<ReceiptFile[]> {
  await ensureReceiptsDir();
  const names = await FileSystem.readDirectoryAsync(receiptsDir);

  const out: ReceiptFile[] = [];
  for (const name of names) {
    const uri = receiptsDir + name;
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || info.isDirectory) continue;
    out.push({
      uri,
      name,
      size: info.size ?? null,
      mtime: info.modificationTime ?? null,
    });
  }
  out.sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0));
  return out;
}

export async function removeReceipt(uri: string) {
  await FileSystem.deleteAsync(uri, { idempotent: true });
}
