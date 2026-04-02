import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

Swiper.use([Pagination, Autoplay, EffectFade]);

@Component({
  selector: 'app-hero',
  imports: [FormsModule, CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      title: 'Phong Cách Tối Giản Aura',
      description: 'Sự thuần khiết trong từng đường nét thiết kế.'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      title: 'Bộ Sưu Tập Mùa Xuân',
      description: 'Cảm hứng từ bầu trời xanh và những đám mây trắng.'
    },
    {
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
      title: 'Trải Nghiệm Êm Ái',
      description: 'Chất liệu cao cấp, mang lại sự thoải mái tuyệt đối cho bạn.'
    }
  ];
  ngAfterViewInit() {
    new Swiper('.mySwiper', {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      effect: 'fade',
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      loop: true
    });
  }
}
