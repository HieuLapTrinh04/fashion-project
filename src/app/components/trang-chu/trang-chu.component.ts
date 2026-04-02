import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Aos from 'aos';
import { FooterComponent } from '../footer/footer.component';
import { HeroComponent } from '../hero/hero.component';
import { WomenFashionComponent } from '../women-fashion/women-fashion.component';
import { MenFashionComponent } from '../men-fashion/men-fashion.component';
import { NewArrivalsComponent } from '../new-arrivals/new-arrivals.component';
import { ContactComponent } from '../contact/contact.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-trang-chu',
  standalone: true,
  imports: [FooterComponent, HeroComponent, WomenFashionComponent, MenFashionComponent, NewArrivalsComponent, ContactComponent, HeaderComponent],
  templateUrl: './trang-chu.component.html',
  styleUrl: './trang-chu.component.css'
})
export class TrangChuComponent implements OnInit {
    ngOnInit() {
      Aos.init({
        duration: 1200,
        easing: 'ease-in-out',
        once: false,
        anchorPlacement: 'top-bottom',
      });
    }
}
