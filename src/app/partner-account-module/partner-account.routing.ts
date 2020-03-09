import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PartnerAccountDashboardComponent } from './partner-account-components/partner-account-dashboard/partner-account-dashboard';
import { PartnerAccountMyDataComponent } from './partner-account-components/partner-account-mydata/partner-account-mydata.component';
import { PartnerAccountAddDataComponent } from './partner-account-components/partner-account-adddata/partner-account-adddata.component';
import { PartnerDataProvider } from './partner-account-components/partner-account-mydata/data-resolver';

const routes:Routes = [
    {
        path:'',
        component:PartnerAccountDashboardComponent
    },
    {
        path:'mydata',
        component:PartnerAccountMyDataComponent,
        resolve:{
            data: PartnerDataProvider
        }
    },
    {
        path:'addData',
        component:PartnerAccountAddDataComponent
    }
];
@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]}
)
export class PartnerAccountRouting{
    constructor(){
    
    }
}