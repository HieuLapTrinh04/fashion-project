import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // API: Lấy danh sách sản phẩm trang 1
  getFashionProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pageFashion`);
  }

  // API: Lấy danh sách sản phẩm trang 2
  getShoesProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pageGiay`);
  }

  // API: Lấy danh sách phụ kiện
  getGiftProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pageAccessories`);
  }
  getProducts() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      this.baseUrl,
      { headers }
    );
  }
}
