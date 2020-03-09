
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientAccountDashboardComponent } from './client-account-components/client-account-dashboard/client.dashboard.component';

const routes:Routes =[

    {
        path : '',
        component: ClientAccountDashboardComponent
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