import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../services/cart.service';
import Aos from 'aos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})

export class ProductsComponent implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];
  
  searchTerm: string = '';
  categoryFilter: string = 'all';
  sortBy: string = 'newest';
  
  categoriesWithCount: { name: string; count: number }[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });
    this.getProducts();

    // Listen for search query from Header (Deep Linking)
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('q');
      if (q !== null) {
        this.searchTerm = q;
        this.applyFilters();
      }
    });
  }

  getProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.calculateCategoryCounts();
        this.applyFilters();
      },
      error: (err) => console.error('Lỗi lấy sản phẩm:', err)
    });
  }

  calculateCategoryCounts() {
    const counts: { [key: string]: number } = {};
    this.allProducts.forEach(p => {
      const cat = p.category || 'Khác';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    this.categoriesWithCount = Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    })).sort((a, b) => b.count - a.count);
  }

  applyFilters() {
    let filtered = this.allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                           (product.brand && product.brand.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    if (this.sortBy === 'newest') {
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (this.sortBy === 'price-asc') {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (this.sortBy === 'price-desc') {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (this.sortBy === 'discount') {
        filtered.sort((a, b) => (Number(b.discount_percent) || 0) - (Number(a.discount_percent) || 0));
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);

    // Scroll to top of product list when changing page
    if (this.currentPage > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  setCategory(cat: string) {
    this.categoryFilter = cat;
    this.applyFilters();
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
      error: (err) => alert('Vui lòng đăng nhập để thêm vào giỏ hàng!')
    });
  }
}
