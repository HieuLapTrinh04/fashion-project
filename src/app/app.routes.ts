import { Routes } from '@angular/router';
import { WomenFashionComponent } from './components/women-fashion/women-fashion.component';
import { NewArrivalsComponent } from './components/new-arrivals/new-arrivals.component';
import { MenFashionComponent } from './components/men-fashion/men-fashion.component';
import { MenPageComponent } from './components/men-page/men-page.component';
import { WomenPageComponent } from './components/women-page/women-page.component';
import { ArrivalsPageComponent } from './components/arrivals-page/arrivals-page.component';
import { TrangChuComponent } from './components/trang-chu/trang-chu.component';
import { LienHeComponent } from './components/lien-he/lien-he.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductsComponent } from './admin/products/admin-products.component';
import { AdminUsersComponent } from './admin/users/admin-users.component';
import { AdminOrdersComponent } from './admin/orders/admin-orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SizeGuideComponent } from './components/size-guide/size-guide.component';
import { PolicyDetailComponent } from './components/policy-detail/policy-detail.component';
import { HotPromotionsComponent } from './components/hot-promotions/hot-promotions.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: TrangChuComponent },
  { path: 'women-fashion', component: WomenPageComponent },
  { path: 'men-fashion', component: MenPageComponent },
  { path: 'new-arrivals', component: ArrivalsPageComponent },
  { path: 'contact', component: LienHeComponent },
  { path: 'size-guide', component: SizeGuideComponent },
  { path: 'policy/:type', component: PolicyDetailComponent },
  { path: 'hot-promotions', component: HotPromotionsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:id', component: ProductDetailComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'my-orders', component: UserOrdersComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'products', component: AdminProductsComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'orders', component: AdminOrdersComponent }
    ]
  },
  // Mapping for legacy routes to avoid broken links
  { path: 'pageFashion', redirectTo: '/women-fashion' },
  { path: 'pageGiay', redirectTo: '/new-arrivals' },
  { path: 'pageQuaTet', redirectTo: '/men-fashion' },
  { path: 'SetQua', redirectTo: '/men-fashion' },
  
  // Fallback
  { path: '**', redirectTo: '/home' }
];
