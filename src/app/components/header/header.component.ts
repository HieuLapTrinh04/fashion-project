import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLogin: boolean = false;
  role: string | null = null;
  cartItemsCount: number = 0;
  searchTerm: string = '';

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.role = localStorage.getItem('role');

    this.isLogin = !!token; // có token => đã login

    // Real-time subscription to cart count
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemsCount = count;
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchTerm } });
      this.searchTerm = ''; // Reset after search
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.isLogin = false;
    this.router.navigate(['/login']);
  }
}
