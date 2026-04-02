import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ⭐ BẮT BUỘC
  styleUrl: './admin-orders.component.css',
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent {
  orders: any[] = [];
  selectedOrder: any = null; // Đơn hàng đang xem chi tiết
  showDetail = false;

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  get headers() {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  loadOrders() {
    this.http.get<any[]>(`${environment.apiUrl}/orders`, this.headers).subscribe({
      next: data => this.orders = data,
      error: err => console.error('Lỗi lấy orders:', err)
    });
  }

  viewDetail(order: any) {
    this.http.get<any>(`${environment.apiUrl}/orders/${order.id}`, this.headers).subscribe({
      next: data => {
        this.selectedOrder = data;
        this.showDetail = true;
      },
      error: err => alert('Lỗi khi lấy chi tiết đơn hàng!')
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    this.http.patch(`${environment.apiUrl}/orders/${orderId}/status`, { status: newStatus }, this.headers).subscribe({
      next: () => {
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder.status = newStatus;
        }
        this.loadOrders();
      },
      error: err => alert('Lỗi cập nhật trạng thái!')
    });
  }

  deleteOrder(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa/hủy đơn hàng này?')) {
      this.http.delete(`${environment.apiUrl}/orders/${id}`, this.headers).subscribe({
        next: () => {
          this.showDetail = false;
          this.loadOrders();
        },
        error: err => alert('Lỗi khi xóa đơn hàng!')
      });
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Đang xác nhận': return 'bg-warning-subtle text-warning';
      case 'Đã xác nhận': return 'bg-info-subtle text-info';
      case 'Đang giao': return 'bg-primary-subtle text-primary';
      case 'Đã giao': return 'bg-success-subtle text-success';
      case 'Đã hủy': return 'bg-danger-subtle text-danger';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }
}
