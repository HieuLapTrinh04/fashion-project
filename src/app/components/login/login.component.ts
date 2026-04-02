import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };
  loginError: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  login() {
  this.http.post<any>(`${environment.apiUrl}/login`, this.loginData)
    .subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);

        if (res.role === "admin") {
          this.router.navigate(["/admin"]);
        } else {
          this.router.navigate(["/"]);
        }
      },
      error: (err) => {
        this.loginError = err.error.message || "Đăng nhập thất bại";
      }
    });
}

}
