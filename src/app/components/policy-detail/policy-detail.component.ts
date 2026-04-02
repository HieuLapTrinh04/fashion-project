import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import Aos from 'aos';

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './policy-detail.component.html',
  styleUrl: './policy-detail.component.css'
})
export class PolicyDetailComponent implements OnInit {
  policyType: string = '';
  policyTitle: string = '';
  policyLastUpdated: string = '02/04/2026';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.policyType = params['type'];
      this.setPolicyContent();
      window.scrollTo(0, 0);
      Aos.init({ duration: 800, once: true });
    });
  }

  setPolicyContent(): void {
    switch (this.policyType) {
      case 'return':
        this.policyTitle = 'CHÍNH SÁCH ĐỔI TRẢ & HOÀN TIỀN';
        break;
      case 'privacy':
        this.policyTitle = 'CHÍNH SÁCH BẢO MẬT THÔNG TIN';
        break;
      case 'shipping':
        this.policyTitle = 'CHÍNH SÁCH VẬN CHUYỂN & KIỂM HÀNG';
        break;
      default:
        this.policyTitle = 'ĐIỀU KHOẢN DỊCH VỤ';
    }
  }
}
