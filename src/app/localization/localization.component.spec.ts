import { AuthenticationService } from '../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, pagination,
    HttpClient, UrlConfigurationService, PiTemplateDetailsService,
    LocaleConfig, LocaleStorage, LocaleService, priceableItemDetailsService,
    contextBarHandlerService, PriceableItemTemplateService, sharedService, TranslatePipe,
    modalService, getWindow, HttpClientTestingModule, showHidefunc, dateFormatPipe, CapabilityService, ObjectToArrayPipe, 
    svcData, loadData, TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, Observable, fakeAsync, tick
} from '../../assets/test/mock';
import { ProductOfferData } from '.../../assets/test/mock-productoffer';
import { MockLocalService } from '../../assets/test/mock-local-service';

import { LocalizationComponent } from './localization.component';
import { LoaderService } from '../helpers/loader/loader.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';
import { localizationService } from './localization.service';
import { Router, ActivatedRoute } from '@angular/router';


describe('LocalizationComponent', () => {
    let component: LocalizationComponent;
    let fixture: ComponentFixture<LocalizationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [LocalizationComponent, TranslatePipe, ObjectToArrayPipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, PiTemplateDetailsService,
                LoaderService, utilService, UrlConfigurationService, contextBarHandlerService,
                LocaleConfig, LocaleStorage, sharedService, modalService, HttpClient, AuthenticationService,
                PriceableItemTemplateService, UtilityService, dateFormatPipe, priceableItemDetailsService,
                TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, CapabilityService, InfiniteScrollCheckService, localizationService,
                { provide: LocaleService, useValue: MockLocalService },
                { provide: 'Window', useFactory: getWindow },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
            ,
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const fixtureBody = `<div class= 'localizationSkeleton'></div>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(LocalizationComponent);
        component = fixture.componentInstance;
        component.LocalizationAsidePanel = showHidefunc;
        fixture.detectChanges();
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        _utilSvc.currentView('ProductOffer');
        component.columnDef = {defaultSortOrder: 'asc', 
        cols: [{field: 'propName', header: 'Object Name', key: 'Object Name'},
            {field: 'kindType', header: 'Object Type', key: 'Object Type'},
            {field: 'property', header: 'Property', key: 'Property'}]};
        component.cols = component.columnDef.cols;
        component.sortQuery = 'propName|asc';
        component.tableQuery = {propName: '%jyothsna%'};
        component.localeFlagData = [{'langCodeId': 840, 'order': 10, 'langCode': 'us', 'description': 'English(US)'}];
        component.filterFields = { propName: 'jyothsna', 'French': 'yajuteja', 'English(US)': 'Audio'};
        component.pagination = pagination;
        component.localizationData = [1, 2, 3, 4];
        component.localizedUnSavedEdit = [1, 2, 3];
    });

    it('should check ObjectToArrayPipe with passing object', () => {
        let pipe: ObjectToArrayPipe;
        pipe = new ObjectToArrayPipe();
        pipe.transform({firstName: 'J', LastName: 'K'});
        expect(pipe.transform({firstName: 'J', LastName: 'K'})).toEqual([{value: 'J', key: 'firstName'}, {value: 'K', key: 'LastName'}])
    })
    it('should create localization component', () => {
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        fixture.detectChanges();
        _utilSvc.currentView('Bundle');
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call clearFilters', () => {
        component.ngOnInit();
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        _utilSvc.changeRemoveScrollHeight(1);
        component.clearFilters('propName');
        expect(component.filterFields['propName']).toEqual('');
        component.removeFilterFetchingError();
        expect(component.filterErrorMessage).toEqual('');
    });
    it('should retrun isFilterText boolean', () => {
        component.isFilterText('propName');
        expect(component.isFilterText('propName')).toBe(true);
    });
    it('should call filterData', () => {
        component.filterData();
    });
    it('should call onModalDialogCloseCancel', () => {
        component.onModalDialogCloseCancel({ index: 1});
    });
    it('should call CaptureFocusedColumn', () => {
        component.CaptureFocusedColumn('column');
    });
    it('should call dataTableOnBlur', () => {
        component.localizedUnSavedEdit = [{ localizationMap: { us: "Audio Conference Call Flat Adjustment1" } }];
        const editData = {};
        const rowIndex = 0;
        const col = { editable: "true", field: "English(US)", filter: true, header: "English(US)", key: "TEXT_ENGLISH(US)", sortable: true }
        const rowdata = { descId: 3185, kind: "ADJUSTMENT", kindType: "Adjustment PI Template", localizationMap: { us: "Audio Conference Call Flat Adjustment" }};
        const dt = { onEditComplete: { emit: ({ column: col, data: rowdata, index: rowIndex }) => { return ''}}}
        component.editDataInfo = {'us': {0: true}};
        component.dataTableOnBlur(col, rowdata, 0, dt);
    });
    it('should call filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
    it('should call saveLocalizationData', () => {
        component.editedRows = [{ 'test': 'testdata' }];
        component.processEditedData();
        component.saveLocalizationData();
    });
    it('should call onModalDialogCloseCancelSave', () => {
        component.fieldName ='us';
        component.localizedUnSavedEdit = [{ localizationMap: { us: "Audio Conference" } }];
        component.localizationData = [{ localizationMap: { us: "Audio Conference1" } }];
        component.dt = { onEditComplete: { emit: () => { return true } } }
        component.onModalDialogCloseCancelSave({ index: 1 });
        component.fieldName = 'us';
        component.onModalDialogCloseCancelSave({ index: 2 });
    });
    it('should call checkFilterLocalizedFields', () => {
        component.checkFilterLocalizedFields([], 'English(US)', 'isSorting');
        component.filterFields = { propName: 'jyothsna', 'French': 'yajuteja', 'English(US)': '' };
        component.langCodeId = 840;
        component.checkFilterLocalizedFields([], 'English(US)', '');
    });
    it('should call onModalDialogDownloadClose', () => {
        component.onModalDialogDownloadClose({index: 1});
    });
    it('should call onModalDialogDownloadSaveClose', () => {
        component.onModalDialogDownloadSaveClose({ index: 1});
    });
    it('should call SaveLocalizationUpdate', () => {
        component.isDownload = true;
        component.isEdited = true;
        component.SaveLocalizationUpdate();
    });
    it('should call getCsvColumns', () => {
        component.getCsvColumns();
    });
    it('should call cancelWithOutSaving', () => {
        component.localizationData = [1,2,3,4];
        component.localizedUnSavedEdit = [1,2,3];
        component.cancelWithOutSaving();
    });
    it('should call getErrorMessageType', () => {
        component.loading = true;
        component.getErrorMessageType();
        component.filterErrorMessage = true;
        component.getErrorMessageType();
        component.filterErrorMessage = false;
        component._localisedList = [];
        component.loading = true;
        component.getErrorMessageType();
        component.filterErrorMessage = false;
        component._localisedList = [];
        component.loading = true;
        component.tableQuery = '';
        component.getErrorMessageType();
        component.filterErrorMessage = false;
        component._localisedList = [1, 2,3];
        component.getErrorMessageType();
    });
    it('should call reinstateLocaleData', () => {
        component.localizationData = [1, 2, 3, 4];
        component.localizedUnSavedEdit = [1, 2, 3];
        component.reinstateLocaleData();
    });
    it('should call openUploadDialog', () => {
        component.csvUploadElement = { nativeElement: { click: () => { } } };
        component.isEdited = true;
        component.openUploadDialog();
        expect(component.confirmDialog).toBe(4);
        component.isEdited = false;
        component.openUploadDialog();
    });
    it('should call uploadWithoutSaving', () => {
        component.csvUploadElement = { nativeElement: {click: () => {}}};
        component.uploadWithoutSaving({index: 1});
        expect(component.confirmDialog).toBe(0);
    });
    it('should call confirmUpload', () => {
        let ev = { index: 1 };
        component.confirmUpload(ev);
        expect(component.confirmDialog).toBe(0);
        if (ev.index === 1) {
            component.uploadLocalizationCSV();
        }
        fixture.detectChanges();
        ev = { index: 0 };
        component.confirmUpload(ev);
        if (ev.index !== 1) {
          component.resetUploadInput();
        }
    });

    it('should call uploadLocalizationCSV on event index is 1', () => {
        const stubVal = {
            data: {
                body: component.selectedFile,
                sendFormData: true
            },
            success: () => {},
            error: () => {},
            onComplete: () => { },
        }
        component.uploadLocalizationCSV();
        fixture.detectChanges();
        expect(component.loading).toBeTruthy();
        let localiService = fixture.debugElement.injector.get(localizationService);
        localiService.importToCSV(stubVal);
    });
    it('should call onUploadComplete', () => {
        component.onUploadComplete(event);
        expect(component.confirmDialog).toBe(0);
    });
    it('should call initiateUpload', () => {
        component.initiateUpload({target: {files: ['sample.csv']}});
    });
    it('should call filterObjectProperties', () => {
        const Obj = {a: 0, b: 1, c: 3};
        const arr = ['a', 'b', 'c'];
        component.filterObjectProperties(Obj, arr);
    });
    it('should call resetUploadInput', () => {
        component.csvUploadElement = { nativeElement: { click: () => { }, value: '' } };
        component.resetUploadInput();
    });
    it('should check loading functions', () => {
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        _utilSvc.changeLocalizationFromContextbar(true);
        _utilSvc.checkIsDonotSavePopupLocalization(true);
        component.getLocalizationDataType();
        expect(component.loading).toBe(true);
    });
    it('should check cancel dialog ', () => {
        component.localeFlagData = [{ description: "English(US)", langCode: "us", langCodeId: 840, order: 10 }];
        component.cookieName = 'us';
        component.checkBoxFields = {
            'English(UK)': false,
            'English(US)': false,
            'French': false,
            'German': false,
            'Spanish': false,
            'Japanese': false,
            'Portuguese-Brazil': false,
            'Italian': false,
            'Spanish-Mexican': false,
            'Hebrew': false,
            'Danish': false,
            'Swedish': false,
            'Arabic': false
        };
        component.checkDefaultLocale();
        component.getlables();
        component.cancelCoverHandler();
        expect(component.showCover).toBe(false);
    });
    it('should check displaying modal popup ', () => {
        component.dataSuccess({records: [], totalCount: 0});
        component.tableQuery = [];
        component.dataSuccess({records: [], totalCount: 1});
        component.refreshLocalizationDataTypeGrid(svcData.reasons);
        component.pagination = pagination;
        let newSvcData = { totalCount: 1, records: [1, 2] };
        component.refreshLocalizationDataTypeGrid(newSvcData);
        component.setPageProperties(svcData.reasons);
        component.displayPOPup();
        expect(component.confirmDialog).toEqual(1);
    });
    it('should add new columns to grid ', () => {
        component.gridColumnOrder = {'Englisth': 'us'};
        component.sortQuery = 'propName|asc';
        component.tableQuery = 'propName=%bun%';
        component.refreshData();
        // check adding new localization columns
        component.addColumn('English');
        component.addColumn('Spanish-Mexican');
        component.lazyLoad = false;
        component.loadData(loadData);
        console.log(component.editedRows);
        component.editedRows = [{'test': 'testdata'}];
        component.processEditedData();
        component.saveGlobalLocalization();
        component.persistLocalizationData([], false);
        component.getDeviceWidth();
    });
    it('should close edit panel localization ', () => {
        // check closing edit panel
        component.isEdited = true;
        component.cancelCoverHandler();
        component.cookieName = 'he';
        component.checkChange('Japanese', 'jp', false);
        component.checkDefaultLocale();
        component.checkChange('French', 'fr', false);
    });
    it('should check localization with failure and success conditions', () => {
        component.pagination = pagination;
        component.currentPage = 'ProductOffer';
        component.closeEditPanel(showHidefunc);
        component.currentPage = 'LOPIDetails';
        component.pagination = pagination;
        component.closeEditPanel(showHidefunc);
        component.currentPage = 'Bundle';
        component.pagination = pagination;
        component.closeEditPanel(showHidefunc);
        component.currentPage = 'PriceableItemTemplates';
        component.pagination = pagination;
        component.closeEditPanel(showHidefunc);
        component.currentPage = 'Subscription';
        component.pagination = pagination;
        component.closeEditPanel(showHidefunc);
        component.currentPage = 'PIDetais';
        component.pagination = pagination;
        component.closeEditPanel(showHidefunc);
        component.typeLocalization = 'PIDetais';
        component.sortQuery = ['Name', 'Unit Name'];
        component.setSortandTableQuery();
    });
    it('should check localization map on blur and check textboxes', () => {
        component.dataSuccess(['French', 'Eng']);
        component.tableQuery = [];
        component.dataSuccess(['French', 'Eng']);
        component.editDataInfo['jp'] = { 'key': true };
        component.checkChange('Japanese', 'jp', false);
        component.editDataInfo['jp'] = {};
        component.checkChange('Japanese', 'jp', false);
        // check localizeMap
        const localizeMap = ProductOfferData.localization.localizeMap[0];
        component.localeData = ProductOfferData.localization.localizeMap;
        ProductOfferData.localization.localizeMap[0].localizationMap.jp = false;
        component.localeData = ProductOfferData.localization.localizeMap;
        expect(component.confirmDialog).toEqual(1);
        component.localizationViewData = { 0: { localizationMap: { 'jp': true } } };
        component.currentpagestatus = true;
        component.localizationSubscriptions = true;
        component.isEdited = true;
        component.savelocalization = false;
        component.nextStateUrl = 'http://localhost/about';
        component.canDeactivate();
        const _utilService = fixture.debugElement.injector.get(utilService);
        _utilService.changePreventUnsaveChange({ url: component.nextStateUrl});
        component.isEdited = false;
        component.canDeactivate();
        component.getLanguageFilterFieldsLength();
        component.showFilterForInfo(component.cols, "clmnNAme");
    });
    it('should call clearOtherLanguageFilters', () => {
        component.ClearOtherLanguageFilters();
    });

    it('should call getLanguageFilterFieldsLength', () => {
        component.getLanguageFilterFieldsLength();
    });

    it('should call showFilterForInfo', () => {
        component.columnDef = {defaultSortOrder: 'asc', 
        cols: [{field: 'propName', header: 'Object Name', key: 'Object Name'},
            {field: 'kindType', header: 'Object Type', key: 'Object Type'},
            {field: 'property', header: 'Property', key: 'Property'}]};
        component.cols = component.columnDef.cols;
        let colname = "kindType";
        component.showFilterForInfo(component.cols, colname);
    });
    it('on escape keydown event handling', () => {
        const event: Event = new KeyboardEvent('keydown', {'code': 'Escape'});
        window.dispatchEvent(event);
        component.confirmDialog = 0;
        component.LocalizationAsidePanel.visibleStatus = true;
        fixture.detectChanges();
        component.handleEscape();
        component.confirmDialog = 1;
        fixture.detectChanges();
        component.handleEscape();
    });
    it('Should call calculateBreadCrumHeight if and if not product page', () => {
        component.isAllProductOfferPage = true;
        fixture.detectChanges();
        component.calculateBreadCrumHeight();
        component.isAllProductOfferPage = false;
        component.calculateBreadCrumHeight();
    });
    it('Should call calculateGridScrollHeight', () => {
        component.loadNgxAside = true;
        component.calculateGridScrollHeight();
        component.loadNgxAside = false;
        component.calculateGridScrollHeight();
    });
    it('Should call initialize', () => {
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        component.initialize();
        let router = fixture.debugElement.injector.get(Router);
        router.navigate(['']);
        _utilSvc.checkIsSaveButtonClickedLocalization(true);
        component.localizationData = [1, 2, 3, 4];
        component.localizedUnSavedEdit = [1, 2, 3];
        _utilSvc.checkCancelLocalization(true);
        component.localizationData = [{ localizationMap: { us: "Audio Conference1" } }];
        component.localizationViewData = [{ localizationMap: { us: "Audio Conference" } }];
        _utilSvc.checkIsDonotSavePopupLocalization(true);
    }); 
    it('should call initLocalizationInAside', fakeAsync(() => {
        const _utilSvc = fixture.debugElement.injector.get(utilService);
        const _capabilityService = fixture.debugElement.injector.get(CapabilityService);
        _capabilityService.loggedInUserCapabilities = {
            UIBreadCrumb: {
                AdjustmentReasons: true, AuditLog: true, Calendars: true
                , Localization: true, Offerings: true, PriceableItemTemplate: true, SharedRates: true, SubscriptionProperties: true
            }
        };
        _utilSvc.changeLocalizationFromContextbar(true);
        component.initLocalizationInAside();
        _utilSvc.currentView('Bundle');
        component.initLocalizationInAside();
        // To check into child PI level
        _utilSvc.currentView('PriceableItemTemplates');
        let route = fixture.debugElement.injector.get(ActivatedRoute);
        route.snapshot.params['templateId'] = 123;
        _utilSvc.addNewRecord({ 'obj': {'childs': [{ 'templateId': 123, 'displayName': 'displayName' }]}, path: '', Level: 'CHILD_PI_OUT' });
        component.initLocalizationInAside();
        // No child PIs
        _utilSvc.currentView('PriceableItemTemplates');
        _utilSvc.addNewRecord({ 'obj': { 'displayName': 'displayName'}, path: '', Level: '' });
        component.initLocalizationInAside();
        _utilSvc.currentView('Subscription');
        component.initLocalizationInAside();
        _utilSvc.currentView('LOPIDetails');
        component.initLocalizationInAside();
        tick(101);
    }));
    it('should call scrollInitialize', () => {
        component.scrollInitialize(pagination);
    });
    it('should call scrollReset', () => {
        component.scrollReset();
    });
    it('should call getMoreData', () => {
        component.localizationData = [1,2,3,4];
        component.totalPageSize = 2;
        component.getMoreData();
    });
    it('should call cancelCoverHandler', () => {
        component.cancelCoverHandler();
        component.isEdited = true;
        component.cancelCoverHandler();
    });
    it('should call removeColumn', () => {
        component.removeColumn('Spanish-Mexican');
        component.removeColumn('property');
    });
    it('should return field when FieldConfig called', () => {
        component.FieldConfig('kindType');
        component.FieldConfig('kindTypes');
    });
    it('should call exportToCSV method', () => {
        component.exportToCSV();
    });
    it("should return true if languageClick method triggered", () => {
        component.languageClick();
        expect(component.languageClick).toBeTruthy();
    });
    it('should call displayDownload', () => {
        component.displayDownload();
        component.isEdited = true;
        component.displayDownload();
    });
    it('should call devideSubStrings', () => {
        component.devideSubStrings('Spanish_Mexican');
    });
    it('should call getLanguageCode', () => {
        component.getLanguageCode('Spanish_Mexican');
        component.getLanguageCode('Portuguese_Brazil');
        component.getLanguageCode('French');
    });
    it('should call resetLocalizedData', () => {
        component.cookieName = 'us';
        component.resetLocalizedData();
        component.cookieName = 'fr';
        component.resetLocalizedData();
    });
    it('should call handleErrorString', () => {
        component.uploadError = { ErrorMessage: ''};
        component.handleErrorString({ errorJsonData: { errorMsg: 'errorMsg'}});
    });
    it('should call handleUploadErrorResponse', () => {
        let errObj = { errorJsonData: { errorMsg: 'errorMsg', ObjectType: 'ObjectType' } }
        component.handleUploadErrorResponse(errObj);
        let errObj2 = { errorJsonData: { errorMsg: 'errorMsg' } }
        component.handleUploadErrorResponse(errObj2);
    });
});
