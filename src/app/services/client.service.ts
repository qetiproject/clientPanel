import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/Client';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private afs: AngularFirestore) {
    this.clientsCollection = this.afs.collection('client', ref => ref.orderBy('lastName', 'asc'));
   }

  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Observable<Client[]>;
  client: Observable<Client>;

   getClients(): Observable<Client[]> {
    // Get clients with the id
    this.clients = this.clientsCollection.snapshotChanges()
    .pipe( map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Client;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
    return this.clients;
   }

   newClient(client: Client) {
    this.clientsCollection.add(client);
   }

   getClient(id: string): Observable<Client> {
     this.clientDoc = this.afs.doc<Client>(`client/${id}`);
     this.client = this.clientDoc.snapshotChanges()
     .pipe(map(action => {
       if (action.payload.exists === false) {
         return null;
       } else {
         const data = action.payload.data() as Client;
         data.id = action.payload.id;
         return data;
       }
     }));
     return this.client;
   }

   updateClient(client: Client) {
    this.clientDoc = this.afs.doc<Client>(`client/${client.id}`);
    this.clientDoc.update(client);
   }
   deleteClient(client: Client) {
    this.clientDoc = this.afs.doc<Client>(`client/${client.id}`);
    this.clientDoc.delete();
   }
}
