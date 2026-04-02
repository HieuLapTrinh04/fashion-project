import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Aos from 'aos';

@Component({
  selector: 'app-lien-he',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './lien-he.component.html',
  styleUrl: './lien-he.component.css'
})
export class LienHeComponent {
  lastUpdated: string = '02/04/2026';

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });
  }

  user = {
    name: '',
    phone: '',
  };

  onSubmit() {
    console.log('Form submitted:', this.user);
    alert('Thông tin đã được gửi!');
  }
}
