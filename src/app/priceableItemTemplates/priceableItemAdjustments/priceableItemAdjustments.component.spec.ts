import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService,
    HttpClient, UrlConfigurationService, HttpHandler, loadData,
    TranslationService, TranslationProvider, TranslationHandler,
    LocaleConfig, LocaleStorage, TranslationConfig, showHidefunc,
    RouterModule, dateFormatPipe, LocaleService, CapabilityService, TranslatePipe
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';


import { PriceableItemAdjustmentComponent } from './priceableItemAdjustments.component';
import { PriceableItemAdjustmentsService } from './priceableItemAdjustments.service';
import { priceableItemDetailsService } from '../../priceableItemDetails/priceableItemDetails.service';
import { PiTemplateDetailsService } from '../piTemplateDetails/piTemplateDetails.service';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return {UIPIDetailsPage: {Adjustments_Edit: true}}; },
    getWidgetCapabilities: () => { return 'UIPIDetailsPage'; },
    findPropertyCapability: () => {}
  };

describe('PriceableItemAdjustmentComponent', () => {
    let component: PriceableItemAdjustmentComponent;
    let fixture: ComponentFixture<PriceableItemAdjustmentComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
            declarations: [PriceableItemAdjustmentComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, PriceableItemAdjustmentsService,
                utilService, UrlConfigurationService, UtilityService, HttpClient, HttpHandler,
                TranslationService, TranslationProvider, TranslationHandler, PiTemplateDetailsService,
                LocaleConfig, LocaleStorage, TranslationConfig, dateFormatPipe, priceableItemDetailsService,
                AuthenticationService,
                { provide: LocaleService, useValue: MockLocalService },
                { provide: CapabilityService, useValue: MockCapabilitiesService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PriceableItemAdjustmentComponent);
        component = fixture.componentInstance;
        component.selectedPriceableItem = ProductOfferData.priceableItemAdj.data;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call functions', () => {
        const _priceableItemAdjustmentsService = fixture.debugElement.injector.get(PriceableItemAdjustmentsService);
        _priceableItemAdjustmentsService.getPiAdjustmentsTypesToBeAdded(ProductOfferData.priceableItemAdj);
        _priceableItemAdjustmentsService.getDefaultAdjustments(ProductOfferData.priceableItemAdj);
        _priceableItemAdjustmentsService.deleteAdjustments(ProductOfferData.priceableItemAdj);
        ProductOfferData.priceableItemAdj.data.isPIInstance = true;
        _priceableItemAdjustmentsService.createNewAdjustments(ProductOfferData.priceableItemAdj);
        ProductOfferData.priceableItemAdj.data.isPIInstance = false;
        _priceableItemAdjustmentsService.createNewAdjustments(ProductOfferData.priceableItemAdj);
        component.adjustmentsResons = showHidefunc;
        component.ngOnInit();
        component.isPItemplate = true;
        expect(component.isPriceableItemTemplate).toBe(true);
        component.priceableItemCheck();
        component.piAdjustments = ProductOfferData.priceableItemAdj.data;
        component.deleteSelectedAdjustments(1);
        component.onToolTipClose();
        expect(component.noReasonCodes).toBe(false);
        component.openDeleteConfirmation(1);
        expect(component.removeAdjustmentfromUI).toBe(false);
        component.deleteErrorMessage();
        expect(component.isDeleteAdjError).toBe(false);
        component.cancelAdjDeleteCard();
        expect(component.removeAdjustmentID).toEqual(-1);
        component.openAdjustmentsSidePanel();
        expect(component.showCover).toBe(true);
        component.closeAdjustmentsSidePanel();
        expect(component.showCover).toBe(false);
        component.newAdjustment = [0];
        component.newAdjustment[0] = ProductOfferData.priceableItemAdj.data;
        component.saveChecks();
        component.newAdjustment[0].adjustmentTypeId = null;
        component.newAdjustment[0].reasonCodes = { 0: { propId: 1 } };
        component.saveChecks();
        component.saveAdjustments();
        component.showReasonsList(0);
        expect(component.showOptions).toBe(true);
        component.showAdjNamesList(0);
        expect(component.showAdjustmentNames).toBe(true);
        expect(component.isAdjustmentReasonEnabled({ adjustmentTypeId: '' })).toBe(false);
        expect(component.isAdjustmentReasonEnabled({ adjustmentTypeId: null })).toBe(true);
        component.onModalDialogCloseDelete(loadData);
        component.onModalDialogCloseCancel(loadData);
        component.cancelCoverHandler();
        component.isSaveEnabled = false;
        component.cancelCoverHandler();
        component.adjustmentEdited(true);
        expect(component.isSaveEnabled).toBe(false);
        component.adjustmentEdited(false);
        expect(component.isSaveEnabled).toBe(true);
        component.addNewAdjustment();
        expect(component.canAddNewAdjustment).toBe(true);
        component.selectReasons(ProductOfferData.priceableItemAdj.data, ProductOfferData.priceableItemAdj.data,
            ProductOfferData.priceableItemAdj.data);
        component.openAdjAsideDeleteConfirmation(ProductOfferData.priceableItemAdj.data, 0);
        component.newAdjustment[0] = ProductOfferData.priceableItemAdj.data;
        component.reasonSelected(0, 1);
    });
});
