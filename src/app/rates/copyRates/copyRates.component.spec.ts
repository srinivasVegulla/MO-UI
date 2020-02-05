import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
    utilService, UtilityService, ajaxUtilService, HttpHandler,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, TranslatePipe,
    loadData, ProductService, RouterModule, modalService, LocaleService,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe, pagination
} from '../../../assets/test/mock';
import { scheduleInfo } from '.../../assets/test/mock-schedule';
import { MockLocalService } from '../../../assets/test/mock-local-service';

import { CopyRatesComponent } from './copyRates.component';
import { RatesService } from '../rates.service';
import { MomentModule } from 'angular2-moment';
import { InfiniteScrollCheckService } from '../../helpers/InfiniteScrollCheck.service';

describe('CopyRatesComponent', () => {
    let component: CopyRatesComponent;
    let fixture: ComponentFixture<CopyRatesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, MomentModule],
            declarations: [CopyRatesComponent, TranslatePipe],
            providers: [utilService, MockBackend, BaseRequestOptions, RatesService,
                ajaxUtilService, UrlConfigurationService, HttpClient, HttpHandler,
                modalService, UtilityService, TranslationService, TranslationConfig,
                TranslationProvider, TranslationHandler, dateFormatPipe, InfiniteScrollCheckService,
                AuthenticationService,
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
        fixture = TestBed.createComponent(CopyRatesComponent);
        component = fixture.componentInstance;
        component.pagination = pagination;
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
    it('should check schedule information values', () => {
        component.rateTableVal = scheduleInfo;
        expect(component.paramTableId).toEqual(scheduleInfo.schedule.ptId);
        expect(component.paramTableName).toEqual(scheduleInfo.schedule.ptName);
        expect(component.toScheduleId).toEqual(scheduleInfo.schedule.schedId);
        component.onModalDialogClose();
        expect(component.confirmDialog).toEqual(0);
        component.columnDef = {defaultSortColumn: 'displayName', defaultSortOrder: 'asc'};
        component.clearFilters('pricelistName');
        expect(component.filterFields['pricelistName']).toEqual('');
        component.rateSchedules = [scheduleInfo.schedule];
        component.getRatesTable(0);
        expect(component.fromScheduleId).toEqual(20159);
        component.lazyLoad = true;
        component.loadData(loadData);
        expect(component.getColumnSortOrder).toEqual('asc');
        component.filterPiDataProcessing = false;
        component.filterDataDelay();
        expect(component.filterPiDataProcessing).toBe(true);
        expect(component.isFilterText('pricelistName')).toBe(false);
        component.columnDef = {defaultSortOrder: 'asc'};
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(1);
        component.columnDef = {defaultSortColumn: 'displayName', defaultSortOrder: 'desc'};
        component.convertDefaultSortOrder();
        expect(component.convertedDefaultSortOrder).toEqual(-1);
        component.getDeviceWidth();
        component.copyRateSchedule();
        component.isRateScheduleError = true;
        component.getErrorMessageType();
    });
    it('should check copy dialog cancel', () => {
        component.onModalDialogCopyCancel();
        expect(component.isCopyEnabled).toBe(true);
    });
    it('should check rates schedules dialog open', () => {
        component.displayCopyRateSchedules();
        expect(component.isCopyEnabled).toBe(false);
    });
    it('should check filterDataKeys', () => {
        component.filterDataKeys('event','displayName','result');
    });
});
