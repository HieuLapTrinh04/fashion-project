import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  products: any[] = [];

  editing = false;
  editId: number | null = null;
  showForm = false;

  form: any = {
    name: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    category: 'Váy',
    brand: 'Aura Fashion',
    old_price: '',
    rating: 5,
    sold_count: 0,
    discount_percent: 0,
    gender: 'Cả hai',
    sizes: 'S,M,L,XL',
    images: ''
  };


  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  get headers() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  loadProducts() {
    this.http
      .get<any[]>(`${environment.apiUrl}/products`)
      .subscribe(data => this.products = data);
  }

  submit() {
    if (this.editing) {
      // UPDATE
      this.http
        .put(
          `${environment.apiUrl}/products/${this.editId}`,
          this.form,
          this.headers
        )
        .subscribe(() => {
          this.loadProducts();
          this.reset();
          this.showForm = false;
        });
    } else {
      // CREATE
      this.http
        .post(
          `${environment.apiUrl}/products`,
          this.form,
          this.headers
        )
        .subscribe(() => {
          this.loadProducts();
          this.reset();
          this.showForm = false;
        });
    }
  }

  submitAndClose() {
    this.submit();
  }

  edit(p: any) {
    this.editing = true;
    this.editId = p.id;
    this.form = { ...p };
  }

  deleteProduct(id: number) {
    if (!confirm('Xóa sản phẩm này?')) return;

    this.http
      .delete(`${environment.apiUrl}/products/${id}`, this.headers)
      .subscribe(() => this.loadProducts());
  }

  reset() {
    this.editing = false;
    this.editId = null;
    this.form = {
      name: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      category: 'Váy',
      brand: 'Aura Fashion',
      old_price: '',
      rating: 5,
      sold_count: 0,
      discount_percent: 0,
      gender: 'Cả hai',
      sizes: 'S,M,L,XL',
      images: ''
    };
  }

  // Auto-calculate price fields
  calculatePrice(source: 'price' | 'old_price' | 'discount'): void {
    const p = parseFloat(this.form.price);
    const op = parseFloat(this.form.old_price);
    const d = parseFloat(this.form.discount_percent);

    if (source === 'old_price' || source === 'discount') {
      // Calculate price based on old_price and discount
      if (!isNaN(op) && !isNaN(d)) {
        this.form.price = Math.round(op * (1 - d / 100));
      } else if (source === 'old_price' && !isNaN(op) && !isNaN(p) && op !== 0) {
        // Fallback: calculate discount if price and old_price exist
        this.form.discount_percent = Math.round(((op - p) / op) * 100);
      }
    } else if (source === 'price') {
      // Calculate discount based on price and old_price
      if (!isNaN(p) && !isNaN(op) && op !== 0) {
        this.form.discount_percent = Math.round(((op - p) / op) * 100);
      } else if (!isNaN(p) && !isNaN(d) && d !== 100) {
        // Fallback: calculate old_price if price and discount exist
        this.form.old_price = Math.round(p / (1 - d / 100));
      }
    }
  }
}
