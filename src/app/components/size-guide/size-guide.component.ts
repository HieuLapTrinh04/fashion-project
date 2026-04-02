import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import Aos from 'aos';

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './size-guide.component.html',
  styleUrl: './size-guide.component.css'
})
export class SizeGuideComponent implements OnInit {

  ngOnInit(): void {
    Aos.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true
    });
    window.scrollTo(0, 0);
  }
}
