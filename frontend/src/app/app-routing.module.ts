import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConnectToWalletComponent } from './connect-to-wallet/connect-to-wallet.component';
import { TendersComponent } from './tenders/tenders.component';
import { ActiveTendersComponent } from './active-tenders/active-tenders.component';
import { MyBidsComponent } from './my-bids/my-bids.component';
import { TenderDetailComponent } from './tender-detail/tender-detail.component';
import { BidsComponent } from './bids/bids.component';
import { TenderAddComponent } from './tender-add/tender-add.component';
import { BidAddComponent } from './bid-add/bid-add.component';
import { BidDetailsComponent } from './bid-details/bid-details.component';

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
  { 
    path: 'my-bids/tender-detail/:id/view', 
    component: TenderDetailComponent,
  },
  { 
    path: 'tender-detail/:id/view', 
    component: TenderDetailComponent,
  },
  { 
    path: 'tender-detail/:id/edit', 
    component: TenderDetailComponent,
  },
  { 
    path: 'tenders/:id/bids', 
    component: BidsComponent, 
  },
  {
    path: 'tenders/add',
    component: TenderAddComponent,
  },
  {
    path: 'active-tenders/:id/bid/add',
    component: BidAddComponent,
  },
  { 
    path: 'active-tenders/:tenderId/bid/:bidId/view', 
    component: BidDetailsComponent, 
  },
  { 
    path: 'active-tenders/:tenderId/bid/:bidId/edit', 
    component: BidDetailsComponent, 
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
