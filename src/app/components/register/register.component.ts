import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-register',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}
  registerData = {
    username: '',
    email: '',
    password: '',
  };
  register() {
    this.http
      .post(`${environment.apiUrl}/register`, this.registerData, {
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          alert('Đăng ký thành công!');
          // Reset form đăng ký
          this.registerData = { username: '', email: '', password: '' };
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.error?.includes('Duplicate')) {
            alert('Email đã tồn tại!');
          } else {
            alert('Đăng ký thất bại!');
          }
        },
      });
  }
}
