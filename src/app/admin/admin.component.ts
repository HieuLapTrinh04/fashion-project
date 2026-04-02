import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core'; 
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('revenueChart') revenueChart!: ElementRef;
  
  public chartInstance: any;
  private routerSub!: Subscription;

  dashStats: any = {
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0,
    chartData: [],
    bestSellers: []
  };

  constructor(public router: Router, private http: HttpClient) {

    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.router.navigate(['/']);
    }

    // Subscribe to router events to reload stats when returning to dashboard
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.urlAfterRedirects === '/admin' || event.url === '/admin') {
        this.loadStats();
      }
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadStats() {
    const token = localStorage.getItem('token');
    this.http.get(`${environment.apiUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.dashStats = data;
        setTimeout(() => this.renderChart(), 100);
      },
      error: (err) => console.error('Lỗi tải stats:', err)
    });
  }

  renderChart() {
    if (!this.revenueChart || !this.dashStats.chartData.length) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.revenueChart.nativeElement.getContext('2d');
    const labels = this.dashStats.chartData.map((d: any) => d.date);
    const totals = this.dashStats.chartData.map((d: any) => d.daily_revenue);

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: totals,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              callback: (value) => value.toLocaleString() + ' đ'
            }
          }
        }
      }
    });
  }

  logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    }
  }
}
