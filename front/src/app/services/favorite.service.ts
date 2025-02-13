import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:8000/favorites'; 

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFavorite(location: any): Observable<any> {
    console.log("oui");
    return this.http.post<any>(`${this.apiUrl}/add`, location);
  }

  removeFavorite(location: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/remove`, location);
  }
}
