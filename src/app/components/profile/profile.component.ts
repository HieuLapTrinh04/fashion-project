import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <app-header></app-header>
    <main class="profile-page py-5 bg-light" style="min-height: 80vh;">
      <div class="container">
        <div class="row g-4 justify-content-center">
          <!-- Cột bên trái: Ảnh đại diện -->
          <div class="col-md-4">
            <div
              class="card border-0 shadow-sm rounded-4 p-4 text-center h-100"
            >
              <div
                class="avatar-wrapper mb-3 position-relative d-inline-block mx-auto"
              >
                <img
                  [src]="
                    user?.avatar ||
                    'https://ui-avatars.com/api/?name=' +
                      (user?.fullname || user?.username) +
                      '&background=random&size=200'
                  "
                  class="rounded-circle shadow-sm"
                  style="width: 150px; height: 150px; object-fit: cover; border: 4px solid #fff;"
                />
                <label
                  for="avatarInput"
                  class="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
                  style="cursor: pointer;"
                >
                  <i class="fa-solid fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  class="d-none"
                  (change)="onFileSelected($event)"
                  accept="image/*"
                />
              </div>
              <h4 class="fw-bold mb-1">
                {{ user?.fullname || user?.username }}
              </h4>
              <p class="text-muted small mb-3">{{ user?.email }}</p>
              <span
                class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill"
              >
                {{ user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng' }}
              </span>
            </div>
          </div>

          <!-- Cột bên phải: Thông tin & Mật khẩu -->
          <div class="col-md-7">
            <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h3 class="fw-bold m-0">
                  <i class="fa-solid fa-user-edit me-2 text-primary"></i>Thông
                  tin cá nhân
                </h3>
                <button
                  *ngIf="!isEditMode"
                  class="btn btn-outline-primary btn-sm rounded-pill px-3"
                  (click)="isEditMode = true"
                >
                  <i class="fa-solid fa-pen me-2"></i> Chỉnh sửa
                </button>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-muted small fw-bold"
                    >Họ và tên</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    [class.border-0]="!isEditMode"
                    [class.bg-light]="!isEditMode"
                    [(ngModel)]="editData.fullname"
                    [readonly]="!isEditMode"
                    placeholder="Chưa cập nhật"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small fw-bold"
                    >Số điện thoại</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    [class.border-0]="!isEditMode"
                    [class.bg-light]="!isEditMode"
                    [(ngModel)]="editData.phone"
                    [readonly]="!isEditMode"
                    placeholder="Chưa cập nhật"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label text-muted small fw-bold"
                    >Địa chỉ Email</label
                  >
                  <input
                    type="email"
                    class="form-control"
                    [class.border-0]="!isEditMode"
                    [class.bg-light]="!isEditMode"
                    [(ngModel)]="editData.email"
                    [readonly]="!isEditMode"
                  />
                </div>

                <div *ngIf="isEditMode" class="col-12 text-end mt-4">
                  <button
                    class="btn btn-light rounded-pill px-4 me-2"
                    (click)="cancelEdit()"
                  >
                    Hủy
                  </button>
                  <button
                    class="btn btn-primary rounded-pill px-4 fw-bold"
                    (click)="saveProfile()"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>

            <!-- Đổi mật khẩu -->
            <div class="card border-0 shadow-sm rounded-4 p-4">
              <h3 class="fw-bold mb-4">
                <i class="fa-solid fa-lock me-2 text-warning"></i>Bảo mật
              </h3>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label text-muted small fw-bold"
                    >Mật khẩu cũ</label
                  >
                  <input
                    type="password"
                    class="form-control bg-light border-0"
                    [(ngModel)]="passwords.oldPassword"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label text-muted small fw-bold"
                    >Mật khẩu mới</label
                  >
                  <input
                    type="password"
                    class="form-control bg-light border-0"
                    [(ngModel)]="passwords.newPassword"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label text-muted small fw-bold"
                    >Xác nhận lại</label
                  >
                  <input
                    type="password"
                    class="form-control bg-light border-0"
                    [(ngModel)]="passwords.confirmPassword"
                  />
                </div>
                <div class="col-12 text-end mt-3">
                  <button
                    class="btn btn-warning text-white rounded-pill px-4 fw-bold"
                    (click)="changePassword()"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      .profile-page {
        animation: fadeIn 0.5s ease;
      }
      .form-control:focus {
        box-shadow: none;
        border-color: #0d6efd;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isEditMode = false;

  editData = {
    fullname: '',
    phone: '',
    email: '',
  };

  passwords = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    this.http
      .get(`${environment.apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (data: any) => {
          this.user = data;
          this.editData = {
            fullname: data.fullname || '',
            phone: data.phone || '',
            email: data.email || '',
          };
        },
        error: (err) => console.error('Lỗi lấy profile:', err),
      });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.loadProfile();
  }

  saveProfile() {
    const token = localStorage.getItem('token');
    this.http
      .patch(`${environment.apiUrl}/profile`, this.editData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          alert('Cập nhật thông tin thành công!');
          this.isEditMode = false;
          this.loadProfile();
        },
        error: (err) => alert(err.error.message || 'Lỗi cập nhật'),
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadAvatar(file);
    }
  }

  uploadAvatar(file: File) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    this.http
      .post(`${environment.apiUrl}/profile/avatar`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res: any) => {
          alert('Cập nhật ảnh đại diện thành công!');
          this.user.avatar = res.avatar;
        },
        error: (err) =>
          alert('Lỗi tải ảnh: ' + (err.error.message || 'Vui lòng thử lại')),
      });
  }

  changePassword() {
    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      return alert('Mật khẩu mới không khớp!');
    }
    if (!this.passwords.oldPassword || !this.passwords.newPassword) {
      return alert('Vui lòng nhập đầy đủ mật khẩu!');
    }

    const token = localStorage.getItem('token');
    this.http
      .patch(
        `${environment.apiUrl}/profile/password`,
        {
          oldPassword: this.passwords.oldPassword,
          newPassword: this.passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .subscribe({
        next: () => {
          alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
          localStorage.clear();
          window.location.href = '/login';
        },
        error: (err) => alert(err.error.message || 'Lỗi đổi mật khẩu'),
      });
  }
}
