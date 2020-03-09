import { NgModule } from '@angular/core';
import { ClientModuleRouting } from './client-account.routing';
import { ClientAccountDashboardComponent } from './client-account-components/client-account-dashboard/client.dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations:[
        ClientAccountDashboardComponent

    ],
    imports:[
        ClientModuleRouting,
        CommonModule
   ],
    exports:[

    ]
})
export class ClientAccountModule{
    constructor(){

    }
}