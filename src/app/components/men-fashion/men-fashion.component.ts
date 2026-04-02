import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import Aos from 'aos';

@Component({
  selector: 'app-men-fashion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './men-fashion.component.html',
  styleUrl: './men-fashion.component.css'
})
export class MenFashionComponent implements OnInit {
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
    this.productService.getShoesProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error('Lỗi lấy sản phẩm Nam:', err)
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
