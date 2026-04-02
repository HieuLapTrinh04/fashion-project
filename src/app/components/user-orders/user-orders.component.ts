import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="my-orders py-5 bg-light" style="min-height: 80vh;">
      <div class="container">
        <h2 class="fw-bold mb-4">Đơn hàng của tôi</h2>
        
        <div *ngIf="orders.length > 0; else noOrders" class="orders-list">
          <div *ngFor="let order of orders" class="card border-0 shadow-sm rounded-4 mb-4 p-4">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div>
                <span class="fw-bold text-primary">#ORD-{{ order.id }}</span>
                <span class="text-muted ms-3 small">{{ order.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <span class="badge" [ngClass]="getStatusClass(order.status)">{{ order.status }}</span>
            </div>
            
            <div class="row">
              <div class="col-md-7 border-md-end mb-3 mb-md-0">
                <div class="mb-3">
                  <p class="mb-1"><i class="fa-solid fa-user me-2 text-muted small"></i> <strong>Người nhận:</strong> {{ order.fullname }}</p>
                  <p class="mb-1"><i class="fa-solid fa-location-dot me-2 text-muted small"></i> {{ order.address }}</p>
                  <p *ngIf="order.notes" class="mb-1 text-muted small"><i class="fa-solid fa-comment-dots me-2"></i> Ghi chú: {{ order.notes }}</p>
                </div>

                <!-- Products Summary -->
                <div *ngIf="order.showItems" class="products-mini-list mt-3" data-aos="fade-in">
                  <div *ngFor="let item of order.items" class="d-flex align-items-center mb-2 px-2 py-1 bg-light rounded-3">
                    <img [src]="item.image" class="rounded-2 me-3 shadow-sm" style="width: 40px; height: 50px; object-fit: cover;">
                    <div class="flex-grow-1 overflow-hidden">
                      <h6 class="mb-0 small fw-bold text-truncate">{{ item.name }}</h6>
                      <div class="d-flex gap-2">
                        <small class="text-muted">{{ item.quantity }} x {{ item.price | number:'1.0-0' }}₫</small>
                        <small class="text-primary fw-bold" *ngIf="item.size">Size: {{ item.size }}</small>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              
              <div class="col-md-5 text-md-end d-flex flex-column justify-content-between">
                <div>
                   <p class="mb-0 text-muted small">Thanh toán:</p>
                   <h4 class="fw-bold text-primary">{{ order.total_price | number:'1.0-0' }} VNĐ</h4>
                </div>
                <div class="mt-3">
                   <button class="btn btn-outline-primary btn-sm rounded-pill px-4" (click)="order.showItems = !order.showItems">
                      {{ order.showItems ? 'Thu gọn' : 'Chi tiết' }}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noOrders>
          <div class="card border-0 shadow-sm rounded-4 p-5 text-center">
             <i class="fa-solid fa-box-open fa-3x text-muted mb-3 opacity-25"></i>
             <h3>Bạn chưa có đơn hàng nào!</h3>
             <p class="text-muted mb-4">Hãy khám phá bộ sưu tập của Aura Fashion ngay nào.</p>
             <div class="text-center">
                <button class="btn btn-primary px-5 py-2 rounded-pill fw-bold" routerLink="/home">MUA SẮM NGAY</button>
             </div>
          </div>
        </ng-template>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .my-orders { animation: fadeIn 0.5s ease; }
    .bg-warning-subtle { background-color: #fffbeb !important; color: #d97706 !important; }
    .bg-info-subtle { background-color: #f0f9ff !important; color: #0284c7 !important; }
    .bg-primary-subtle { background-color: #eff6ff !important; color: #2563eb !important; }
    .bg-success-subtle { background-color: #f0fdf4 !important; color: #16a34a !important; }
    .bg-danger-subtle { background-color: #fef2f2 !important; color: #dc2626 !important; }
    
    @media (min-width: 768px) {
      .border-md-end { border-right: 1px solid #dee2e6 !important; }
    }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>(`${environment.apiUrl}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Lỗi lấy đơn hàng của bạn:', err)
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Đang xác nhận': return 'bg-warning-subtle text-warning badge';
      case 'Đã xác nhận': return 'bg-info-subtle text-info badge';
      case 'Đang giao': return 'bg-primary-subtle text-primary badge';
      case 'Đã giao': return 'bg-success-subtle text-success badge';
      case 'Đã hủy': return 'bg-danger-subtle text-danger badge';
      default: return 'bg-secondary-subtle text-secondary badge';
    }
  }
}
