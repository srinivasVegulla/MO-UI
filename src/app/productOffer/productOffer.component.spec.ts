import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, CapabilityService,
    HttpClient, UrlConfigurationService, HttpClientTestingModule,
    AddSubscriptionPropertiesService, svcData, priceableItemDetailsService,
    ReactiveFormsModule, FormsModule, ProductService, sharedService, contextBarHandlerService,
    LocaleService, LocaleConfig, LocaleStorage, modalService, dateFormatPipe,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, inject,
  } from '../../assets/test/mock';
import { MockAuthenticationService, AuthenticationService } from '../../assets/test/mock-authentication-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

import { ProductOfferComponent } from './productOffer.component';
import { preventUnsavedChangesGuard } from './prevent-unsaved-changes.gaurd';
import { AddPriceableItemService } from './priceableItems/add-priceable-items/add-priceable-items.service';
import { InUseOfferingsModalDialogService } from '../inUseOfferingsModalDialog/inUseOfferingsModalDialog.service';
import { SubscriptionPropertyDetailsService } from '../subscriptionPropertyDetails/subscriptionPropertyDetails.service';

describe('ProductOfferComponent', () => {
    let component: ProductOfferComponent;
    let fixture: ComponentFixture<ProductOfferComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ReactiveFormsModule, HttpClientTestingModule, FormsModule],
            declarations: [ProductOfferComponent],
            providers: [ProductService, utilService, MockBackend, BaseRequestOptions,
                sharedService, contextBarHandlerService, UtilityService, utilService, ajaxUtilService,
                UrlConfigurationService, preventUnsavedChangesGuard, AddPriceableItemService,
                LocaleService, LocaleConfig, LocaleStorage, modalService, InUseOfferingsModalDialogService,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler,
                AddSubscriptionPropertiesService, priceableItemDetailsService, HttpClient, CapabilityService, SubscriptionPropertyDetailsService, dateFormatPipe,
                { provide: AuthenticationService, useValue: MockAuthenticationService},
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(inject([CapabilityService], _capabilityService  => {
        _capabilityService.loggedInUserCapabilities = {UIPoDetailsPage: {Delete: true}};
        const fixtureBody = `<div class="propertiesSkeleton"></div>
        <div class="extendedPropertiesSkeleton"></div>
        <div class="subscriptionProperties"></div>
        <div class="permissionSkeleton"></div>`;
        document.body.insertAdjacentHTML(
          'afterbegin',
          fixtureBody);
        fixture = TestBed.createComponent(ProductOfferComponent);
        component = fixture.componentInstance;
    }));

    it('should create ProductOfferComponent', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call subscription properties method', () => {
        component.getSubscriptionProperties();
    });

    it('should call functions', () => {
        const _productService = fixture.debugElement.injector.get(ProductService);
        _productService.changeNextStateURL('');
        _productService.changeSaveProductOffer(true);
        _productService.getProduct(svcData);
        _productService.getCreatePOConfig([]);
        _productService.createPOForm({key: []}, true, []);
        _productService.deletePODetail(svcData);
        _productService.getPONameAvailability(svcData);
        _productService.getPODisplayNameAvailability(svcData);
         svcData.data.type = 'PO';
        _productService.updateProductOffer(svcData);
         svcData.data.type = 'BUNDLE';
        _productService.updateProductOffer(svcData);
        svcData.data.type = 'BUNDLE';
        _productService.updateProductOffer(svcData);
        _productService.changeSelectedPoCheckPi([]);
        _productService.copyOfferingData(svcData);
         component.productOfferId = svcData.data.productOfferId;
         component.ngOnInit();
         component.hidePropertiesWidget(true);
         expect(component.showLocalizationPanel).toBe(false);
         component.handleErrorDeletePO(svcData.error);
         expect(component.isDeletePOError).toBe(true);
         component.removeError();
         expect(component.createPOErrorMessage).toBe(false);
         component.deleteErrorMessage();
         expect(component.isDeletePOError).toBe(false);
         component.updateProductOffer(true);
         component.openPOLocations();
         expect(component.openOfferingUsedLocations).toBe(true);
         component.setLocalStorageValues(ProductOfferData.productOffer);
    });
});