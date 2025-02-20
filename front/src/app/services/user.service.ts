// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/user';  // The endpoint for user data

  constructor(private http: HttpClient) {}

  // Fetch user info from the backend
  getUserInfo(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
