import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  onSnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/portfolio.model';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  // Upload file to Firebase Storage
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  // Generic method to get all documents from a collection as real-time stream
  getCollection<T>(path: string): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      const colRef = collection(this.firestore, path);
      return onSnapshot(
        colRef,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
          subscriber.next(items);
        },
        (error) => subscriber.error(error)
      );
    });
  }

  // Generic method to get a single document as real-time stream
  getDoc<T>(path: string, id: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      const docItem = doc(this.firestore, `${path}/${id}`);
      return onSnapshot(
        docItem,
        (snapshot) => {
          if (snapshot.exists()) {
            subscriber.next({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            subscriber.next(undefined as any);
          }
        },
        (error) => subscriber.error(error)
      );
    });
  }

  // Generic method to update a document
  update(path: string, id: string, data: any) {
    const docItem = doc(this.firestore, `${path}/${id}`);
    return updateDoc(docItem, data);
  }

  // Create or override a document
  save(path: string, id: string, data: any) {
    const docItem = doc(this.firestore, `${path}/${id}`);
    // Ensure we don't save the 'id' field inside the document data
    const { id: _, ...cleanData } = data;
    return setDoc(docItem, cleanData);
  }

  // Delete a document
  delete(path: string, id: string) {
    const docItem = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(docItem);
  }

  // Get a single document as a Promise (one-time fetch)
  async get(path: string, id: string): Promise<any> {
    const docItem = doc(this.firestore, `${path}/${id}`);
    const snapshot = await getDoc(docItem);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  // Paginated projects
  getProjectsPaginated(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot<Project>
  ): Observable<{ data: Project[]; lastDoc: QueryDocumentSnapshot<Project> | null }> {
    return new Observable((subscriber) => {
      const colRef = collection(this.firestore, 'projects');
      const constraints: any[] = [orderBy('order'), limit(pageSize)];
      if (lastDoc) constraints.push(startAfter(lastDoc));

      const q = query(colRef, ...constraints);
      getDocs(q)
        .then((snapshot) => {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
          const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
          subscriber.next({ data, lastDoc: lastVisible as any });
          subscriber.complete();
        })
        .catch((err) => subscriber.error(err));
    });
  }
}
