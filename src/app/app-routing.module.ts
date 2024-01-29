import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { canActivateLoggedIn, canActivateHasAccess, CanActivateRole } from './guards/auth-guard.guard';

import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/register/register/register.component';
import { GetUsersComponent } from './get-users/get-users.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ProductsComponent } from './products/products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SellComponent } from './sell/sell.component';
import { AddInformationsComponent } from './add-informations/add-informations.component';
import { GetInformationsComponent } from './get-informations/get-informations.component';
import { SoldCartsComponent } from './sold-carts/sold-carts.component';
import { StatsComponent } from './stats/stats.component';
import { NotificationComponent } from './notification/notification.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SafeComponent } from './safe/safe.component';
import { LossesComponent } from './losses/losses.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { DeviceListComponent } from './device-list/device-list/device-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:id/edit', component: RegisterComponent },
  { path: 'users', component: GetUsersComponent},
  { path: 'print',  component: PrintLayoutComponent},
  { path: 'admin', component: AdminPageComponent, canActivate: [canActivateLoggedIn, CanActivateRole] },
  { path: 'products', component: ProductsComponent},
  { path: 'devices', component: DeviceListComponent},
  { path: 'addProduct', component: AddProductsComponent},
  { path: 'addProduct/:id/edit', component: AddProductsComponent},
  { path: 'sell', component: SellComponent},
  { path: 'addInformation', component: AddInformationsComponent},
  { path: 'addInformation/:id/edit', component: AddInformationsComponent },
  { path: 'informations', component: GetInformationsComponent},
  { path: 'soldCarts', component: SoldCartsComponent},
  { path: 'soldCarts/:id/edit', component: SellComponent},
  { path: 'stats', component: StatsComponent},
  { path: 'notifications', component: NotificationComponent},
  { path: 'expenses', component: ExpensesComponent},
  { path: 'safe', component:SafeComponent},
  { path: 'losses', component:LossesComponent},
  { path: 'companyDetails', component:CompanyDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


