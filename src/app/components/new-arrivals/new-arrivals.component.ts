import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import Aos from 'aos';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css']
})
export class NewArrivalsComponent implements OnInit {
  products: any[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getGiftProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error('Lỗi lấy sản phẩm mới:', err)
    });
  }

  addProductToCart(product: any) {
    const cartProduct = {
      product_id: product.id, 
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    this.cartService.addToCart(cartProduct).subscribe({
      next: () => alert('Đã thêm sản phẩm vào giỏ hàng!'),
      error: (err) => alert('Vui lòng đăng nhập để mua hàng!')
    });
  }
}
