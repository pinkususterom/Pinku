// IndexedDB helper for storing customized photos, voice recordings, and greeting configurations.

const DB_NAME = 'BirthdaySurpriseDB';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('recordings')) {
        db.createObjectStore('recordings');
      }
    };
  });
}

export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('settings', 'readonly');
    const store = tx.objectStore('settings');
    const request = store.get(key);
    request.onsuccess = () => {
      resolve(request.result !== undefined ? request.result : defaultValue);
    };
    request.onerror = () => resolve(defaultValue);
  });
}

export interface StoredPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  order: number;
}

export async function savePhoto(photo: StoredPhoto): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const request = store.put(photo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getPhotos(): Promise<StoredPhoto[]> {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    const request = store.getAll();
    request.onsuccess = () => {
      const list = request.result || [];
      resolve(list.sort((a, b) => a.order - b.order));
    };
    request.onerror = () => resolve([]);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveVoiceRecording(blob: Blob): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    const store = tx.objectStore('recordings');
    const request = store.put(blob, 'voice_memo');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getVoiceRecording(): Promise<Blob | null> {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('recordings', 'readonly');
    const store = tx.objectStore('recordings');
    const request = store.get('voice_memo');
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => resolve(null);
  });
}

export async function deleteVoiceRecording(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recordings', 'readwrite');
    const store = tx.objectStore('recordings');
    const request = store.delete('voice_memo');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
