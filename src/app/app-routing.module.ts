import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './Welcome.component';
import { ProductOfferComponent } from './productOffer/productOffer.component';
import { ProductOfferListComponent } from './productOfferList/productOfferList.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './security/auth.guard';
import { PageNotFoundComponent } from './errorhandler/PageNotFound.component';
import { preventUnsavedChangesGuard } from './productOffer/prevent-unsaved-changes.gaurd';
import { PriceableItemDetailsComponent } from './priceableItemDetails/priceableItemDetails.component';
import { priceableItemDetailsUnsavedChangesGuard } from './priceableItemDetails/priceableItemDetails-unsaved-changes.guard';
import { AccessGuard } from './productOffer/access-guard';
import { LocalizationComponent } from './localization/localization.component';
import { ApprovalComponent } from './approval/approval.component';
import { BundleComponent } from './bundle/bundle.component';
import { SharedPricelistComponent } from './sharedPricelist/shared.pricelist.component';
import { AuditLogComponent } from './auditLog/auditLog.component';
import { SharedPricelistDetailsComponent } from './sharedPricelist/ratelistDetails/sharedPricelistDetails.component';
import { SubscriptionPropertyDetailsComponent } from './subscriptionPropertyDetails/subscriptionPropertyDetails.component';
import { UnsavedChangesGuard } from './helpers/unsaved-changes-guard.service';
import { PriceableItemTemplateComponent } from './priceableItemTemplates/priceableItemTemplate.component';
import { PiTemplateDetailsComponent } from './priceableItemTemplates/piTemplateDetails/piTemplateDetails.component';
import { AdjustmentReasonsGridComponent } from './adjustmentReasonsGrid/adjustmentReasonsGrid.component';
import { PriceableItemAdjustmentComponent } from './priceableItemTemplates/priceableItemAdjustments/priceableItemAdjustments.component';
import { CalendarListComponent } from './Calendars/calendars-list.component';
import { DetailCalendarComponent } from './Calendars/calendar-detail/calendar-detail.component';

const appRoutes: Routes = [
  {
    path: 'ProductCatalog', component: WelcomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'Offerings', component: ProductOfferListComponent, canDeactivate: [preventUnsavedChangesGuard] },
      { path: 'ProductOffer/:productOfferId', component: ProductOfferComponent, canDeactivate: [preventUnsavedChangesGuard, UnsavedChangesGuard], canActivate: [AccessGuard] },
      { path: 'Bundle/:bundleId', component: BundleComponent, canDeactivate: [preventUnsavedChangesGuard, UnsavedChangesGuard] },
      { path: 'CreateProductOffer', component: ProductOfferComponent, canDeactivate: [preventUnsavedChangesGuard] },
      { path: 'ProductOfferListComponent', component: ProductOfferListComponent },
      { path: 'PriceableItem/:productOfferId/:itemInstanceId/:PIType/:child', component: PriceableItemDetailsComponent, canDeactivate: [priceableItemDetailsUnsavedChangesGuard, UnsavedChangesGuard], canActivate: [AccessGuard] },
      { path: 'Localization', component: LocalizationComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'Approval', component: ApprovalComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'PriceableItem/:productOfferId/:itemInstanceId/:PIType', component: PriceableItemDetailsComponent, canDeactivate: [priceableItemDetailsUnsavedChangesGuard, UnsavedChangesGuard], canActivate: [AccessGuard] },
      { path: 'BundleProductOffer/:bundleId/:productOfferId', component: ProductOfferComponent, canDeactivate: [preventUnsavedChangesGuard], canActivate: [AccessGuard] },
      { path: 'SharedRatelist', component: SharedPricelistComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'AuditLog', component: AuditLogComponent},
      { path: 'ratelistDetails/:pricelistId', component: SharedPricelistDetailsComponent, canDeactivate: [UnsavedChangesGuard]},
      { path: 'SubscriptionProperties', component: SubscriptionPropertyDetailsComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'PriceableItemTemplates', component: PriceableItemTemplateComponent },
      { path: 'PriceableItemTemplates/:templateId/:kind', component: PiTemplateDetailsComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'PriceableItemTemplates/:templateId/:kind/:isChild', component: PiTemplateDetailsComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'AdjustmentReasonsGrid', component: AdjustmentReasonsGridComponent, canDeactivate: [UnsavedChangesGuard]},
      { path: 'PriceableItemTemplates', component: PriceableItemAdjustmentComponent},
      { path: 'Calendars', component: CalendarListComponent, canDeactivate: [UnsavedChangesGuard]},
      { path: 'Calendars/:calendarId', component: DetailCalendarComponent, canDeactivate: [UnsavedChangesGuard] }
    ]
  },
  { path: 'login', component: LoginComponent},
  { path: '404', component: PageNotFoundComponent },
  { path: '', redirectTo: 'ProductCatalog/Offerings', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
