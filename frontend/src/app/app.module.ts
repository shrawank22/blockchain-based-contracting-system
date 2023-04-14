import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ConnectToWalletComponent } from './connect-to-wallet/connect-to-wallet.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { MatTableModule } from '@angular/material/table';
import { TendersComponent } from './tenders/tenders.component';
import { ActiveTendersComponent } from './active-tenders/active-tenders.component'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyBidsComponent } from './my-bids/my-bids.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { TenderDetailComponent } from './tender-detail/tender-detail.component';
import { BidAddComponent } from './bid-add/bid-add.component';
import { BidsComponent } from './bids/bids.component';
import { TenderAddComponent } from './tender-add/tender-add.component';
import { BidDetailsComponent } from './bid-details/bid-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    ConnectToWalletComponent,
    CustomTableComponent,
    TendersComponent,
    ActiveTendersComponent,
    MyBidsComponent,
    TenderDetailComponent,
    BidAddComponent,
    BidsComponent,
    BidDetailsComponent,
    TenderAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CdkAccordionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
