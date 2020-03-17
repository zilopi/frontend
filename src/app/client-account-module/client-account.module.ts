import { NgModule } from '@angular/core';
import { ClientModuleRouting } from './client-account.routing';
import { ClientAccountDashboardComponent } from './client-account-components/client-account-dashboard/client.dashboard.component';
import { CommonModule } from '@angular/common';
import { ClientViewPurchases } from './client-account-components/client-view-purchases/client-view-purchases';
import { ClientPurchase } from './client-account-components/client-view-purchases/purchases-component/purchase.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations:[
        ClientAccountDashboardComponent,
        ClientViewPurchases,
        ClientPurchase
    ],
    imports:[
        ClientModuleRouting,
        CommonModule,
        NgbModule
   ],
    exports:[

    ]
})
export class ClientAccountModule{
    constructor(){

    }
}