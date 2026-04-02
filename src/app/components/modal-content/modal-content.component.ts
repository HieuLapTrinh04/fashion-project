import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Aos from 'aos';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-modal-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.css'
})
export class ModalContentComponent implements OnInit{
 products: any[] = []
     newProduct = {
       name: '',
       description: '',
       price: 0,
       stock: 0, image: 'assets/images/....'
     };
     productIdToDelete: number = 0;
     constructor(private http: HttpClient, private router: Router) {}
     ngOnInit() : void{
       Aos.init({
         duration: 1200,
         easing: 'ease-in-out',
         once: false, // Lặp lại hiệu ứng khi cuộn
         anchorPlacement: 'top-bottom', // Vị trí kích hoạt
       });
       this.getProducts();
       }
 
     getProducts() {
       this.http.get(`${environment.apiUrl}/products`).subscribe((data: any) => {
         this.products = data;
         console.log(this.products);
       });
     }
 
     postProduct() {
       const apiUrl = `${environment.apiUrl}/products`; // URL API POST
           this.http.post(apiUrl, this.newProduct, {responseType: 'text'}).subscribe({
         next: (response) => {
           console.log('Sản phẩm đã được tạo:', response);
           this.getProducts(); // Tải lại danh sách sản phẩm sau khi tạo thành công
           window.location.reload(); // Tải lại trang
           alert('Sản phẩm đã được thêm thành công')
         }, error :
         (error) => {
           console.error('Lỗi khi tạo sản phẩm:', error);
         }
     });
     }
   
     deleteProduct() {
       const apiUrl = `${environment.apiUrl}/products/${this.productIdToDelete}`;
       this.http.delete(apiUrl).subscribe({
         next: (response: any) => {
           console.log('Sản phẩm đã bị xóa:', response);
           this.getProducts(); // Tải lại danh sách sản phẩm sau khi xóa
           window.location.reload(); // Tải lại trang
           alert('Sản phẩm đã được xóa thành công')

         },
         error: (error: any) => {
           // console.error('Lỗi khi xóa sản phẩm:', error);
           this.getProducts(); // Tải lại danh sách sản phẩm sau khi xóa
           window.location.reload(); // Tải lại trang
           alert('Sản phẩm đã được xóa thành công')

         },
       });
     }
}
