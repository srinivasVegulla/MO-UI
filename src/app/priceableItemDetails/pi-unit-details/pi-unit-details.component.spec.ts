import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, inject,
    utilService, UtilityService, ajaxUtilService, sharedService,
    HttpClient, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
    FormsModule, ReactiveFormsModule, HttpHandler, TranslationService, TranslationConfig,
    TranslationProvider, TranslationHandler, TranslationModule, modalService, CapabilityService,
    priceableItemDetailsService, PiTemplateDetailsService, showHidefunc, loadData, keyEventData,
    FormGroup, FormControl, dateFormatPipe
} from '../../../assets/test/mock';
import { PiUnitDetails } from '../../../assets/test/mock-piunitdetails';

import { PIUnitDetailsComponent } from './pi-unit-details.component';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';

const MockCapabilitiesService = {
    loggedInUserCapabilities: () => { return {UIPoDetailsPage: {ExtProps_Edit: true}}; },
    findPropertyCapability: () => { return 'UIPoDetailsPage'; },
    fetchUserCapabilities: () => {}
};

describe('PIUnitDetailsComponent', () => {
    let component: PIUnitDetailsComponent;
    let fixture: ComponentFixture<PIUnitDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, TranslationModule.forRoot()],
            declarations: [PIUnitDetailsComponent],
            providers: [sharedService, MockBackend, BaseRequestOptions, utilService, UtilityService,
                modalService, priceableItemDetailsService, ajaxUtilService, HttpClient, TranslationService,
                HttpHandler, UrlConfigurationService, LocaleConfig, LocaleStorage, LocaleService,
                TranslationConfig, TranslationProvider, TranslationHandler, PiTemplateDetailsService, dateFormatPipe,
                AuthenticationService,
                { provide: CapabilityService, useValue: MockCapabilitiesService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // service is mentioned to whom component is interacting
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div [formGroup]="myGroup">
                            <input formControlName="unitName">
                            </div><div id="initFocusUDName"></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(PIUnitDetailsComponent);
        component = fixture.componentInstance;
        component.PIUnitDetailsForm = new FormGroup({
            unitName: new FormControl('unitName'),
            unitDisplayName: new FormControl(),
            ratingType: new FormControl(),
            integral: new FormControl(),
            minUnitValue: new FormControl(),
            maxUnitValue: new FormControl(),
            validEnumValues: new FormControl()
        });
        component.PIUnitDetailsForm.setValue(PiUnitDetails);
        fixture.detectChanges();
    });
    it('should create login component', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.ngOnInit();
    });
    it('should process unit details', () => {
        const sampleMethods = showHidefunc;
        component.unitDetailsWidget = sampleMethods;
        component.priceableItemData = PiUnitDetails;
        component.PIdata = {sortedEnumValues:  [3, 4, 6, 5], PiUnitDetails};
        component.processGeneralProperties(PiUnitDetails);
        expect(component.PIUnitDetailsForm instanceof FormGroup).toBe(true);
        component.PIUnitDetailsForm.controls['unitDisplayName'].setValue('Unit name');
        expect(component.PIUnitDetailsForm['_value'].unitDisplayName).toEqual('Unit name');
        expect(component.PIUnitDetailsForm.dirty).toBe(false);
        component.closeEditPanel();
        component.onModalDialogCloseCancel(loadData);
        expect(component.confirmDialog).toEqual(0);
        component.displayCoverHandler(sampleMethods);
        component.validEnum = [0, 1];
        component.validEnum[0] = 0;
        component.validEnum = '';
        expect(component.showMessage).toEqual('space');
        component.cancelCoverHandler();
        expect(component.showCover).toBe(false);
        expect(component.PIUnitDetailsForm instanceof FormGroup).toBe(true);
        component.PIUnitDetailsForm.controls['unitName'].setValue(ProductOfferData.properties.name);
        component.PIUnitDetailsForm.controls['unitDisplayName'].setValue(ProductOfferData.properties.displayName);
        component.savePIunitDetails(sampleMethods);
        component.openInUseOfferings();
        component.disableMathKeys(keyEventData);
        keyEventData.keyCode = 69;
        component.disableMathKeys(keyEventData);
        component.removeSpace();
    });
    it('Should not allow spaces', () => {
        keyEventData.keyCode = 32;
        component.disableSpace(keyEventData);
    });
});
