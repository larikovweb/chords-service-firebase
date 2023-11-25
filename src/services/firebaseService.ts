import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';
import { FirebaseError } from 'firebase/app';

interface Response<T> {
  loading: boolean;
  data: T | null;
  error: FirebaseError | null;
}

export async function getData<T>(path: string): Promise<Response<T>> {
  const db = getDatabase();

  try {
    const dbRef = ref(db, path);
    const snapshot = await get(dbRef);
    return { loading: false, data: snapshot.val(), error: null };
  } catch (error) {
    return { loading: false, data: null, error: error as FirebaseError };
  }
}

export async function setData<T>(path: string, data: T): Promise<Response<T>> {
  const db = getDatabase();

  try {
    // Create a new child location with a unique key
    const dbRef = push(ref(db, path));
    // Set the data at the new child location
    await set(dbRef, data);
    return { loading: false, data, error: null };
  } catch (error) {
    return { loading: false, data: null, error: error as FirebaseError };
  }
}

export async function updateData<T extends object>(path: string, data: T): Promise<Response<T>> {
  const db = getDatabase();

  try {
    const dbRef = ref(db, path);
    await update(dbRef, data);
    return { loading: false, data, error: null };
  } catch (error) {
    return { loading: false, data: null, error: error as FirebaseError };
  }
}

export async function deleteData(path: string): Promise<Response<null>> {
  const db = getDatabase();

  try {
    const dbRef = ref(db, path);
    await remove(dbRef);
    return { loading: false, data: null, error: null };
  } catch (error) {
    return { loading: false, data: null, error: error as FirebaseError };
  }
}
