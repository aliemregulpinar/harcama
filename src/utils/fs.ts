// src/utils/fs.ts
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

function slash(s: string) { return s.endsWith('/') ? s : s + '/'; }

const base = slash(
  (FileSystem.documentDirectory ??
    FileSystem.cacheDirectory ??
    (Platform.OS === 'web' ? '/' : 'file:///')) as string
);

export const receiptsDir = base + 'receipts/';
export const indexPath = receiptsDir + 'index.json';

export type ReceiptMeta = {
  id: string;
  uri: string;
  fileName: string;
  createdAt: number;     // ms
  store?: string;
  total?: number;        // TL
  notes?: string;
  category?: string;
};

export async function ensureReceiptsDir() {
  const info = await FileSystem.getInfoAsync(receiptsDir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
  }
  const idx = await FileSystem.getInfoAsync(indexPath);
  if (!idx.exists) {
    await FileSystem.writeAsStringAsync(indexPath, '[]');
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
    try { await FileSystem.deleteAsync(srcUri, { idempotent: true }); } catch {}
  }
  return dest;
}

export async function readIndex(): Promise<ReceiptMeta[]> {
  await ensureReceiptsDir();
  try {
    const txt = await FileSystem.readAsStringAsync(indexPath);
    const arr = JSON.parse(txt) as ReceiptMeta[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export async function writeIndex(items: ReceiptMeta[]) {
  await ensureReceiptsDir();
  await FileSystem.writeAsStringAsync(indexPath, JSON.stringify(items));
}

export async function upsertMeta(meta: ReceiptMeta) {
  const items = await readIndex();
  const i = items.findIndex(x => x.id === meta.id);
  if (i >= 0) items[i] = meta; else items.push(meta);
  await writeIndex(items);
}

export async function findMetaByUri(uri: string): Promise<ReceiptMeta | null> {
  const items = await readIndex();
  return items.find(x => x.uri === uri) ?? null;
}

export async function listReceiptsFiles() {
  await ensureReceiptsDir();
  const names = await FileSystem.readDirectoryAsync(receiptsDir);
  const files = [];
  for (const name of names) {
    if (name === 'index.json') continue;
    const uri = receiptsDir + name;
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || info.isDirectory) continue;
    files.push({ uri, name, mtime: info.modificationTime ?? null });
  }
  files.sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0));
  return files;
}

export async function removeReceiptAndMeta(uri: string) {
  await FileSystem.deleteAsync(uri, { idempotent: true });
  const items = await readIndex();
  const filtered = items.filter(x => x.uri !== uri);
  await writeIndex(filtered);
}
