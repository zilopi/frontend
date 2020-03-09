import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PartnerAccountRouting } from './partner-account.routing';
import { PartnerAccountDashboardComponent } from './partner-account-components/partner-account-dashboard/partner-account-dashboard';
import { PartnerAccountMyDataComponent } from './partner-account-components/partner-account-mydata/partner-account-mydata.component';
import { PartnerAccountAddDataComponent} from './partner-account-components/partner-account-adddata/partner-account-adddata.component';
import { PartnerDataResultComponent } from './partner-account-components/partner-data-results/partnerDataResult.component';
import { DataService } from '../services/component-data-share-service/data-share.service';

@NgModule({
    declarations:[
        PartnerDataResultComponent,
        PartnerAccountAddDataComponent,
        PartnerAccountDashboardComponent,
        PartnerAccountMyDataComponent
    ],
    imports:[

        CommonModule,
        PartnerAccountRouting,
        ReactiveFormsModule,

    ],
    exports:[
        // PartnerAccountModule
    ]
})
export class PartnerAccountModule{
    constructor(){

    }
    static  forRoot(): ModuleWithProviders<PartnerAccountModule>{
       return {
           ngModule: PartnerAccountModule,
           providers:[
               DataService
           ]
       }
    }
}