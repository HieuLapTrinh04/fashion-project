import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  
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

  updateQuantity(cartItemId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseInt(inputElement.value, 10);

    if (quantity <= 0) {
      alert('Số lượng phải lớn hơn 0!');
      return;
    }

    this.cartService.updateCartItem(cartItemId, quantity).subscribe({
      next: () => {
        const item = this.cartItems.find((i) => i.id === cartItemId);
        if (item) item.quantity = quantity;
        this.calculateTotalPrice();
      },
      error: (err) => console.error('Lỗi khi cập nhật số lượng:', err),
    });
  }

  removeProductFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
        this.calculateTotalPrice();
      },
      error: (error) => console.error('Lỗi khi xóa sản phẩm:', error)
    });
  }

  goToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
