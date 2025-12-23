import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore);

  // Generic method to get all documents from a collection
  getCollection<T>(path: string): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    return collectionData(colRef as any, { idField: 'id' } as any) as Observable<T[]>;
  }

  // Generic method to get a single document
  getDoc<T>(path: string, id: string): Observable<T> {
    const docItem = doc(this.firestore, `${path}/${id}`);
    return docData(docItem, { idField: 'id' } as any) as Observable<T>;
  }

  // Generic method to update a document
  update(path: string, id: string, data: any) {
    const docItem = doc(this.firestore, `${path}/${id}`);
    return updateDoc(docItem, data);
  }

  // Create or override a document
  save(path: string, id: string, data: any) {
    const docItem = doc(this.firestore, `${path}/${id}`);
    return setDoc(docItem, data);
  }
}
