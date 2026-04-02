import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';
import Aos from 'aos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hot-promotions',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './hot-promotions.component.html',
  styleUrl: './hot-promotions.component.css'
})
export class HotPromotionsComponent implements OnInit, OnDestroy {
  promoProducts: any[] = [];
  loading: boolean = true;
  
  // Countdown State
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private timerInterval: any;

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchPromoProducts();
    this.startCountdown();
    Aos.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  fetchPromoProducts(): void {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        // Filter products with discount and sort by discount descending
        this.promoProducts = data
          .filter(p => (p.discount_percent || 0) > 0)
          .sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))
          .slice(0, 12);
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm khuyến mãi:', err);
        this.loading = false;
      }
    });
  }

  startCountdown(): void {
    // Simulated countdown: 3 hours from now
    const target = new Date();
    target.setHours(target.getHours() + 3);
    
    const update = () => {
      const currentTime = new Date().getTime();
      const diff = target.getTime() - currentTime;
      
      if (diff <= 0) {
        this.hours = 0; this.minutes = 0; this.seconds = 0;
        return;
      }
      
      this.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      this.minutes = Math.floor((diff / (1000 * 60)) % 60);
      this.seconds = Math.floor((diff / 1000) % 60);
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  addProductToCart(product: any): void {
    const cartItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://placehold.co/600x800/f3f4f6/6b7280?text=Product',
      quantity: 1,
      size: 'M' // Default size
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => alert(`Đã thêm ${product.name} vào giỏ hàng!`),
      error: (err) => console.error('Lỗi thêm giỏ hàng:', err)
    });
  }
}
