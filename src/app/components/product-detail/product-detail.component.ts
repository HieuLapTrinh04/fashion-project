import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})


export class ProductDetailComponent implements OnInit {
  product: any = null;
  selectedSize: string = '';
  quantity: number = 1;
  loading: boolean = true;
  availableSizes: string[] = [];
  galleryImages: string[] = [];
  activeImage: string = '';
  activeIndex: number = 0;

  // Lightbox State
  isLightboxOpen: boolean = false;
  lightboxScale: number = 1;
  translateX: number = 0;
  translateY: number = 0;
  isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;

  // Size Guide Modal State
  isSizeGuideModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProduct(id);
    }
  }

  fetchProduct(id: string): void {
    this.http.get(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (data: any) => {
        this.product = data;
        this.loading = false;
        
        // Parse sizes
        if (this.product.sizes) {
          this.availableSizes = this.product.sizes.split(',');
        } else {
          this.availableSizes = ['S', 'M', 'L', 'XL'];
        }

        // Parse gallery images
        this.galleryImages = [];
        if (this.product.image) {
          this.galleryImages.push(this.product.image);
        }
        if (this.product.images) {
          const extra = this.product.images.split(',').map((s: string) => s.trim()).filter((s: string) => s);
          this.galleryImages = [...this.galleryImages, ...extra];
        }
        // Deduplicate
        this.galleryImages = [...new Set(this.galleryImages)];
        
        this.activeImage = this.galleryImages[0] || this.product.image;
        this.activeIndex = 0;
      },
      error: (err) => {
        console.error('Lỗi tải chi tiết sản phẩm:', err);
        this.loading = false;
      }
    });
  }

  setActiveImage(index: number): void {
    this.activeIndex = index;
    this.activeImage = this.galleryImages[index];
  }

  nextImage(): void {
    this.activeIndex = (this.activeIndex + 1) % this.galleryImages.length;
    this.activeImage = this.galleryImages[this.activeIndex];
    this.resetZoom();
  }

  prevImage(): void {
    this.activeIndex = (this.activeIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.activeImage = this.galleryImages[this.activeIndex];
    this.resetZoom();
  }

  // Lightbox Methods
  openLightbox(index: number): void {
    this.activeIndex = index;
    this.activeImage = this.galleryImages[index];
    this.isLightboxOpen = true;
    this.resetZoom();
    document.body.style.overflow = 'hidden'; 
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  toggleSizeGuideModal(): void {
    this.isSizeGuideModalOpen = !this.isSizeGuideModalOpen;
    if (this.isSizeGuideModalOpen) {
      document.body.style.overflow = 'hidden';
      
      // Auto-scroll logic based on product category
      setTimeout(() => {
        const productName = this.product?.name?.toLowerCase() || '';
        let targetId = '';
        
        if (productName.includes('nam') || productName.includes('men')) {
          targetId = 'men-size-section';
        } else if (productName.includes('nữ') || productName.includes('women')) {
          targetId = 'women-size-section';
        }
        
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  zoomIn(): void {
    if (this.lightboxScale < 4) this.lightboxScale += 0.25;
  }

  zoomOut(): void {
    if (this.lightboxScale > 0.5) this.lightboxScale -= 0.25;
    if (this.lightboxScale < 1) this.resetZoom();
  }

  resetZoom(): void {
    this.lightboxScale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  handleWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  // PANNING LOGIC
  startDrag(event: MouseEvent | TouchEvent): void {
    if (this.lightboxScale <= 1) return;
    this.isDragging = true;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.startX = clientX - this.translateX;
    this.startY = clientY - this.translateY;
  }

  onDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.translateX = clientX - this.startX;
    this.translateY = clientY - this.startY;
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  incrementQty(): void {
    this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích thước (size)!');
      return;
    }

    const cartItem = {
      product_id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.activeImage || this.product.image || 'https://placehold.co/600x800/f3f4f6/6b7280?text=Product',
      quantity: this.quantity,
      size: this.selectedSize
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        alert('Đã thêm sản phẩm vào giỏ hàng!');
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Lỗi thêm giỏ hàng:', err);
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng.');
      }
    });
  }
}
