import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`; // URL API của server backend
  
  // Real-time cart tracking
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCount(); // Initial count load
  }

  // Update the shared cart count
  updateCount(): void {
    this.getCartItems().subscribe({
      next: (items) => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCountSubject.next(count);
      },
      error: (err) => console.error('Lỗi khi cập nhật giỏ hàng:', err)
    });
  }

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(items => {
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCountSubject.next(count);
      })
    );
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: { product_id: number; name: string; price: number; image: string; quantity: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      tap(() => this.updateCount())
    );
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cartItemId}`).pipe(
      tap(() => this.updateCount())
    );
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cartItemId}`, { quantity }).pipe(
      tap(() => this.updateCount())
    );
  }
}
