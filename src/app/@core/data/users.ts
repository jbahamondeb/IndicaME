import { Observable } from 'rxjs';

export interface User {
  name: string;
  picture: string;
  type: number;
}

export interface Contacts {
  user: User;
  type: string;
}

export interface RecentUsers extends Contacts {
  time: number;
}

export abstract class UserData {
  
  abstract getUser(data): Observable<User>;
  abstract getContacts(): Observable<Contacts[]>;
  abstract getRecentUsers(): Observable<RecentUsers[]>;
}
