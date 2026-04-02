import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    HeaderComponent, 
    FooterComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  checkoutMessage: string = '';
  isProcessing: boolean = false;

  deliveryInfo = {
    fullname: '',
    phone: '',
    address: '',
    notes: '' // New notes field
  };

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        if (this.cartItems.length === 0) {
          this.router.navigate(['/cart']);
        }
        this.calculateTotalPrice();
      },
      error: (error) => console.error('Lỗi khi lấy giỏ hàng:', error),
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  processCheckout(): void {
    if (!this.deliveryInfo.fullname || !this.deliveryInfo.phone || !this.deliveryInfo.address) {
      alert('Vui lòng nhập đầy đủ các trường thông tin bắt buộc (Họ tên, SĐT, Địa chỉ)!');
      return;
    }

    this.isProcessing = true;
    const orderData = { 
      totalPrice: this.totalPrice,
      fullname: this.deliveryInfo.fullname,
      phone: this.deliveryInfo.phone,
      address: this.deliveryInfo.address,
      notes: this.deliveryInfo.notes // Sending notes to backend
    };

    const token = localStorage.getItem('token');
    this.http.post(`${environment.apiUrl}/checkout`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response: any) => {
        this.isProcessing = false;
        alert('🎉 Đặt hàng thành công! Cảm ơn bạn đã tin tưởng Aura Fashion.');
        this.cartService.updateCount(); // Clear header badge
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.isProcessing = false;
        this.checkoutMessage = 'Đặt hàng thất bại: ' + (err.error?.message || 'Vui lòng thử lại!');
        alert(this.checkoutMessage);
      },
    });
  }
}
