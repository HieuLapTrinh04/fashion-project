import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  companyInfo = {
    name: 'Aura Fashion',
    address:
      '720A Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh, Hồ Chí Minh',
    hotline: '1900 123 456',
    email: 'support@aurafashion.vn',
    paymentIcons: [
      'assets/images/visa.svg',
      'assets/images/mastercard.svg',
      'assets/images/amex.svg',
      'assets/images/discover.svg',
    ],
  };
  menuWeb = [
    { name: 'Liên hệ', link: '/contact' },
  ];

  customerSupport = [
    { name: 'Hỗ trợ khách hàng', link: '/support' },
    { name: 'Điều khoản & dịch vụ', link: '/terms' },
    { name: 'Hướng dẫn thanh toán', link: null }, // disabled link
  ];
}
