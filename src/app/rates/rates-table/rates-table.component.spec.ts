import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService, CapabilityService,
    HttpClient, UrlConfigurationService, HttpClientTestingModule,
    modalService, LocaleService, TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,
    LocaleConfig, LocaleStorage, showHidefunc, loadData, TranslatePipe
} from '../../../assets/test/mock';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { ProductOfferData } from '../../../assets/test/mock-productoffer';

import { RatesTableComponent } from './rates-table.component';
import { RatesService } from '../rates.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { CalendarsService } from '../../Calendars/calendars-list.service';

describe('RatesTableComponent', () => {
    let component: RatesTableComponent;
    let fixture: ComponentFixture<RatesTableComponent>;
    

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            declarations: [RatesTableComponent, TranslatePipe],
            providers: [utilService, MockBackend, BaseRequestOptions, RatesService, UtilityService,
                ajaxUtilService, UrlConfigurationService, modalService, DragulaService, dateFormatPipe,
                TranslationService, LocaleService, LocaleConfig, LocaleStorage, TranslationConfig,
                TranslationProvider, TranslationHandler, HttpClient, CalendarsService, AuthenticationService, CapabilityService,
                { provide: LocaleService, useValue: MockLocalService },
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
        const fixtureBody = `<table id='ecb-rateTableEdit' class= "ecb-rateTable">
                            <thead><tr><th><span></span></th>
                            <th><span></span></th></tr></thead>
                            <tbody><tr><td><input/></td></tr>
                            <tr><td><input/></td></tr>
                            <tr><td><input/></td></tr></tbody>
                            </table>`;
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixtureBody);
        fixture = TestBed.createComponent(RatesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
       
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should call ngOnInit', () => {
        component.ngOnInit();
    });
    it('should initialize values in rates component', () => {
        component.setRateTableColumns('rate', 'rate source', true, false, ProductOfferData.rateTables.metaData);
        expect(component.staticLocalizedCols.length).toEqual(4);
        localStorage.setItem('ProductOffer', '{"nonsharedPlId": 1}');
        component.getRowClass(ProductOfferData.rateTables, 0);
        component.handleError('Error occured');
        expect(component.rateTableLoading).toBe(false);
        expect(component.rateTableFetchError).toEqual('Error occured');
        const getStringDt = component.getOperator('string|dataType');
        expect(getStringDt[0].value).toEqual('EQUALS');
        component.storeOperators('char');
        component.rateTableInfo = ProductOfferData.rateTables;
        component.rateTableEditDataList[0] = [];
        component.showRateTable();
        component.getAllRules();
        expect(component.selectedSchedule).toEqual(ProductOfferData.rateTables.schedule);
        component.deleteRateFromList(1, 1);
        expect(component.rateTableEditDataList.length).toEqual(1);
        component.getRateData(ProductOfferData.rateTables.records[0]);
        expect(ProductOfferData.rateTables.records[0].actions.UnitAmount).toEqual(10);
        expect(component.isRateListEmptyOrOnlyDefault()).toBe(true);
        expect(component.addaRowForViewMode(ProductOfferData.rateTables)).toEqual(ProductOfferData.rateTables);
        component.rateInfo = {parameterTableMetaData: {}, schedule: {schedId: 1}};
        component.setRateTableColsDef([], []);
        component.getBooleanTextForViewMode('char', 'name');
        component.processMetaData(ProductOfferData.rateTables.records);
        component.createRateTable();
        component.rateTableDataList = [{},{}];
        expect(component.rateTableDataList.length).toBeGreaterThan(1);
        component.isStaticColumn('MOVE');
        component.isRuleMiscproperties(0);
        component.displayCoverHandler(showHidefunc);
        expect(component.isSaveEnabled).toBe(false);
        component.delteRateObj = loadData;
        component.closeEditPanel();
        component.onModalDialogCloseCancel(loadData);
        component.onModalDialogCloseDelete(loadData);
        component.cancelCoverHandler();
        expect(component.isSaveEnabled).toBe(false);
        component.prepareRulesToPersist();
        component.rateTableDataListBeforeDrag = [0];
        component.rateTableDataListBeforeDrag[0] = {default: true};
        component.rateTableEditDataList = [0];
        component.rateTableEditDataList[0] = {default: true};
        component.onRowMove();
        component.isVisibleForEditDefaultRate(0, 'Amount');
        component.setHasDefaultRate(true);
        expect(component.hasDefaultRateEdit).toBe(true);
        component.displayCopyRateSchedules();
        expect(component.copyRateSchedules).toBe(true);
        component.onModalDialogCopyCancel([]);
        component.checkDefaultRateAllowed();
        component.clearDrag();
        component.metaDataAsPerRuleName = ProductOfferData.rateTables.opParmeter;
        const columnData = {field: 'RCAmount|30'};
        component.getTableHeaderName(columnData);
        component.getOpForConditions(columnData.field);
        component.hasEnumData('RCAmount');
        component.datesFormateHandler([]);
        component.isMetaDataColumns('|condOperator');
        component.getRuleRecordDetail('test');
        component.deleteClickFromView(showHidefunc, 0);
        component.ngOnDestroy();
        expect(component.isRatesFormDirty).toBe(false);
        component.verifyRatesTableForNulls();
        component.exportToXML();
        component.disableDeleteIcon();
        component.disableMoveIcon();
        component.disableExistingDeleteIcon();
        component.onToolTipClose(true);
        component.conditions = [];
        component.actions = [];
        const rules = {}
        const emptyConditons = 1;
        const noOfConditions = 1;
        component.isRowTypeDefault(rules, emptyConditons, noOfConditions);
        component.checkDefaultRateAllowed();
        component.checkIfRatesTableisDirty();
        // should check when selcted schedule is undefined
        component.selectedSchedule = undefined
        component.getAllRules();
        component.setRateTableColumns('rate', 'rate source', true, [], ProductOfferData.rateTables.metaData);
    });

        it("it should call isRowTypeDefault",  ()=> {
        const rules = {};
        const emptyConditons = 1;
        const noOfConditions = 1;
        component.isRowTypeDefault(rules, emptyConditons, noOfConditions);
    });

    it("it should call createADefaultRateRecord",  ()=> {
        component.rateInfo = {parameterTableMetaData: {}, schedule: {schedId: 1}};
        component.selectedSchedule = ProductOfferData.rateTables.schedule;
        component.conditions = [];
        component.actions = [];
        component.getNewRecord(false);
        component.getNewRecord(true);
        component.createADefaultRateRecord();
    });

    it("it should call checkIfRatesTableisDirty",  ()=> {
        component.rateInfo = {parameterTableMetaData: {}, schedule: {schedId: 1}};
        component.selectedSchedule = ProductOfferData.rateTables.schedule;
        component.conditions = [];
        component.actions = [];
        component.getNewRecord(false);
        component.getNewRecord(true);
        component.getAllRules();
        component.checkIfRatesTableisDirty();
    });
});
