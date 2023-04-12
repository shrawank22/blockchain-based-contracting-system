import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConnectToWalletComponent } from './connect-to-wallet/connect-to-wallet.component';
import { TendersComponent } from './tenders/tenders.component';
import { ActiveTendersComponent } from './active-tenders/active-tenders.component';
import { MyBidsComponent } from './my-bids/my-bids.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'connect-to-wallet',
    component: ConnectToWalletComponent,
  },
  {
    path: 'tenders',
    component: TendersComponent,
  },
  {
    path: 'active-tenders',
    component: ActiveTendersComponent,
  },
  {
    path: 'my-bids',
    component: MyBidsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
