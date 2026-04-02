import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import Aos from 'aos';

@Component({
  selector: 'app-women-fashion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './women-fashion.component.html',
  styleUrls: ['./women-fashion.component.css']
})
export class WomenFashionComponent implements OnInit {
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
    this.productService.getFashionProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => console.error('Lỗi lấy sản phẩm Nữ:', err)
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
