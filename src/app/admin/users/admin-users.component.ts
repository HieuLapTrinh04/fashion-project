import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ⭐ BẮT BUỘC: Thêm FormsModule
  styleUrl: './admin-users.component.css',
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent {
  users: any[] = [];
  
  showForm = false;
  editing = false;
  editId: number | null = null;
  
  form: any = {
    username: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  get headers() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  loadUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/users`, this.headers)
      .subscribe({
        next: data => this.users = data,
        error: err => console.error('Lỗi lấy danh sách user:', err)
      });
  }

  submit() {
    if (this.editing) {
      // UPDATE USER
      this.http.put(`${environment.apiUrl}/users/${this.editId}`, this.form, this.headers)
        .subscribe({
          next: () => {
            alert('Cập nhật người dùng thành công!');
            this.loadUsers();
            this.reset();
            this.showForm = false;
          },
          error: err => alert('Lỗi cập nhật: ' + (err.error?.message || err.message))
        });
    } else {
      // CREATE USER (Dùng endpoint /register)
      this.http.post(`${environment.apiUrl}/register`, this.form, this.headers)
        .subscribe({
          next: () => {
            alert('Tạo người dùng thành công!');
            this.loadUsers();
            this.reset();
            this.showForm = false;
          },
          error: err => alert('Lỗi khi tạo: ' + (err.error?.message || err.message))
        });
    }
  }

  edit(u: any) {
    this.editing = true;
    this.editId = u.id;
    this.form = { 
        username: u.username, 
        email: u.email, 
        role: u.role,
        password: '' // Reset password trường khi edit
    };
    this.showForm = true;
  }

  deleteUser(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) return;

    this.http.delete(`${environment.apiUrl}/users/${id}`, this.headers)
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: err => alert(err.error?.message || 'Lỗi khi xóa người dùng')
      });
  }

  reset() {
    this.editing = false;
    this.editId = null;
    this.form = {
      username: '',
      email: '',
      password: '',
      role: 'user'
    };
  }
}
