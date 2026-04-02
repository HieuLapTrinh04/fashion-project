import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import Aos from 'aos';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-arrivals-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './arrivals-page.component.html',
  styleUrl: './arrivals-page.component.css'
})


export class ArrivalsPageComponent implements OnInit {
  productIdToDelete: number = 0;
  shoesProducts: any[] = [];

  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: ''
  };

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });

    this.getProducts();

    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách giỏ hàng:', error);
      }
    });
  }

  getProducts() {
    // API pageAccessories đã được cấu hình trả về 8 sản phẩm mới nhất (ORDER BY id DESC LIMIT 8)
    this.http.get(`${environment.apiUrl}/products/pageAccessories`).subscribe({
      next: (data: any) => {
        this.shoesProducts = data;
        this.products = data;
        console.log('Đã tải sản phẩm mới nhất:', data);
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm mới:', err);
      }
    });
  }

  openModal(): void {
    this.dialog.open(ModalContentComponent, {
      width: '800px',
      data: { message: 'Hello từ component cha!' }
    });
  }

  postProduct() {
    const apiUrl = `${environment.apiUrl}/products`;
    this.http.post(apiUrl, this.newProduct, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.getProducts();
      },
      error: (error) => {
        console.error('Lỗi khi tạo sản phẩm:', error);
      }
    });
  }

  deleteProduct() {
    const apiUrl = `${environment.apiUrl}/products/${this.productIdToDelete}`;
    this.http.delete(apiUrl).subscribe({
      next: (response: any) => {
        this.getProducts();
      },
      error: (error: any) => {
        this.getProducts();
      },
    });
  }

  products: any[] = [];
  cartItems: any[] = [];

// Thêm sản phẩm vào giỏ hàng
addProductToCart(product: any) {
  const cartItem = {
    product_id: product.id, // Sử dụng ID từ product
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1, // Mặc định là 1
  };

  this.cartService.addToCart(cartItem).subscribe({
    next: (response) => {
      console.log('Thêm sản phẩm thành công:', response);
      this.ngOnInit(); // Refresh danh sách sản phẩm
    },
    error: (error) => {
      console.error('Lỗi khi thêm sản phẩm:', error);
    },
    complete: () => {
      console.log('Thêm sản phẩm hoàn tất.');
    },
  });
}

// Xóa sản phẩm khỏi giỏ hàng
removeProductFromCart(cartItemId: number) {
  this.cartService.removeFromCart(cartItemId).subscribe({
    next: (response) => {
      console.log('Xóa sản phẩm thành công:', response);
      this.ngOnInit(); // Refresh danh sách sản phẩm
    },
    error: (error) => {
      console.error('Lỗi khi xóa sản phẩm:', error);
    },
    complete: () => {
      console.log('Xóa sản phẩm hoàn tất.');
    }
});
}

// Cập nhật số lượng sản phẩm
updateQuantity(cartItemId: number, event: Event): void {
  const inputElement = event.target as HTMLInputElement;
const quantity = parseInt(inputElement.value, 10); // Chuyển giá trị sang số nguyên
  this.cartService.updateCartItem(cartItemId, quantity).subscribe({
    next: (response) => {
      console.log('Cập nhật số lượng thành công:', response);
      this.ngOnInit(); // Refresh danh sách sản phẩm
    },
    error: (error) => {
      console.error('Lỗi khi cập nhật số lượng:', error);
    },
    complete: () => {
      console.log('Cập nhật số lượng hoàn tất.');
    }
});
}

}
