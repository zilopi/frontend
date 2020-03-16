import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ClientRegistrationComponent } from './components/client-registration/client-registration.component';
import { PartnerRegistrationComponent } from './components/partner-registration/partner-registration.component';
import { RootComponent } from './login/root/root.component';
import { UserComponent } from './login/user/user.component';
import { PartnerComponent } from './login/partner/partner.component';
import { AccountService } from './services/account-service/account.service';
import {ReactiveFormsModule} from '@angular/forms';
import { PartnerAccountModule } from './partner-account-module/partner-account.module';
import { AuthGuard } from './services/account-service/authorization-service/authorization.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { RegistrationService } from './services/registration-service/registration-service';
import { LoginService } from './services/login-service/login-service';
import { PartnerDataUploadService } from './services/upload-partner-data-service/upload-partner-data-service';
import { UpdateAboutMeService } from './services/account-service/aboutMeUpdate-service/aboutMeUpdate-service';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchService } from './services/search-service/search.service';
import { RouteReuseStrategy } from '@angular/router';
import { CacheRouteReuseStratergy } from './services/component-reuse-handler/PageReuse';
import { APP_BASE_HREF } from '@angular/common';
import { SearchItem } from './components/search-page/search-item.component/search-item.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ViewSearchDetailsComponent } from './components/search-page/view-details.component/view-details.component';
import { ClientAccountModule } from './client-account-module/client-account.module';
import { UpdateWalletAndTransact } from './services/update-client-wallet-service/updateWallet.service';
import { RegisterComponent } from './components/register-accounts/register-accounts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LandingPageComponent,
    ClientRegistrationComponent,
    PartnerRegistrationComponent,
    RootComponent,
    UserComponent,
    PartnerComponent,
    SearchItem,
    SearchPageComponent,
    ViewSearchDetailsComponent,
    RegisterComponent
   
  ],
  imports: [
   
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    PartnerAccountModule.forRoot(),
    ClientAccountModule,
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass :CacheRouteReuseStratergy
  },
  {
    provide:APP_BASE_HREF,
    useValue :"/"
  },
    UpdateWalletAndTransact,
    SearchService,LoginService,RegistrationService,AccountService,AuthGuard,PartnerDataUploadService,UpdateAboutMeService,UpdateWalletAndTransact],
  bootstrap: [AppComponent]
})
export class AppModule { }
