
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientAccountDashboardComponent } from './client-account-components/client-account-dashboard/client.dashboard.component';
import { ClientViewPurchases } from './client-account-components/client-view-purchases/client-view-purchases';

const routes:Routes =[

    {
        path : '',
        component: ClientAccountDashboardComponent
    },
    {
        path:'view-purchases',
        component:ClientViewPurchases
    }
]
@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})
export class ClientModuleRouting{
    constructor(){

    }
}