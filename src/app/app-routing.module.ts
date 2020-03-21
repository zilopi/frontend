import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ClientRegistrationComponent } from './components/client-registration/client-registration.component';
import { PartnerRegistrationComponent } from './components/partner-registration/partner-registration.component';
import { RootComponent } from './login/root/root.component';
import { UserComponent } from './login/user/user.component';
import { PartnerComponent } from './login/partner/partner.component';
import { AuthGuard } from './services/account-service/authorization-service/authorization.service';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchResolver } from './components/search-page/resolve-data';
import { ViewSearchDetailsComponent } from './components/search-page/view-details.component/view-details.component';
import { RegisterComponent } from './components/register-accounts/register-accounts.component';



const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo:'landing-page'
  },
  {
    path:'landing-page',
    component: LandingPageComponent
  },

{path: 'login',
component: RootComponent,
children: [
  {
    path: 'client',
    component: UserComponent
  },
  {
    path: 'partner',
    component: PartnerComponent
  }
]
}
,
{
  path: 'partner-account',
  canActivate: [AuthGuard ],
  loadChildren: './partner-account-module/partner-account.module#PartnerAccountModule'
},
{
  path: 'client-account',
  loadChildren : './client-account-module/client-account.module#ClientAccountModule'
  // src/app/client-account-module/client-account.module.ts
  // loadChildren : 'src/app/client-account-module/client-account.module#ClientAccountModule'
},

// {
//   path:'**',
//   redirectTo:'search',
//   pathMatch:'full'
// },
  {
    path:'search/:query',
    component:SearchPageComponent,
    resolve:{
      results:SearchResolver
    }
  },
  {
    path:'view',
    component:ViewSearchDetailsComponent
  },
  {
    path:'register',
    component:RegisterComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'top',onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
