import { AuthenticationService } from '../../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http,
    utilService, UtilityService, ajaxUtilService,
    HttpClient, UrlConfigurationService, HttpClientTestingModule, contextBarHandlerService,
    loadData, modalService, LocaleService, TranslatePipe, inject,
    TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, dateFormatPipe,
    showHidefunc, FormsModule, ReactiveFormsModule, CapabilityService, LocaleConfig, LocaleStorage
} from '../../../assets/test/mock';
import { scheduleInfo } from '../../../assets/test/mock-schedule';
import { ProductOfferData } from '../../../assets/test/mock-productoffer';
import { MockLocalService } from '../../../assets/test/mock-local-service';
import { MomentModule } from 'angular2-moment';

import { SchedulesComponent } from './schedules.component';
import { LocalStorage } from '@ng-idle/core';


describe('SchedulesComponent', () => {
    let component: SchedulesComponent;
    let fixture: ComponentFixture<SchedulesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MomentModule],
            declarations: [SchedulesComponent, TranslatePipe],
            providers: [MockBackend, BaseRequestOptions, ajaxUtilService, UrlConfigurationService, dateFormatPipe,
                utilService, modalService, contextBarHandlerService, TranslationHandler, UtilityService, LocaleService,
                LocaleConfig, LocaleStorage, TranslationService, TranslationConfig, TranslationProvider, CapabilityService,
                AuthenticationService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SchedulesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
    });
    it('should be initialize values', () => {
        component.reLoadRateSchedules();
        expect(component.schedulesLoading).toBe(true);
        component.rateScheduleData = { rateSchedules: [0] };
        component.selectedRate = ProductOfferData.ratesData;
        component.rateSchedulesExisting = [0];
        component.rateSchedulesExisting[0] = scheduleInfo.schedule;
        component.auditlogHistoryAside = showHidefunc;
        component.subscriptionCount = 1;
        expect(component.noOfSubscriber).toEqual(1);
        component.schedulesLoadingInfo = true;
        expect(component.schedulesLoading).toBe(true);
        component.onToolTipClose(true);
        component.addNewSchedule(showHidefunc, 0, true, true);
        component.datesFormateHandler(component.rateSchedulesExisting);
        component.setRateSchedule();
        component.disableExistingDeleteIcon();
        component.disableDeleteIcon();
        component.deleteScheduleFromList(true, 0);
        component.clearHighlight();
        component.displayCoverHandler(showHidefunc);
        component.updateExistingScheduleIdsList();
        component.closeEditPanel();
        component.onModalDialogCloseDelete(loadData);
        component.onModalDialogCloseCancel(loadData);
        component.cancelCoverHandler();
        component.processSchedules(showHidefunc);
        component.launchAuditLogWidget(showHidefunc);
        component.closeAduitLogAside();
        expect(component.showCover).toBe(false);
        component.rateSchedules[0] = scheduleInfo.schedule;
        component.endDateValidations([], [], 0, true);
        component.getRatesTable(0);
        component.getRowClass({ error: 'sample' }, 0);
        component.deleteSchedule(component.rateSchedulesExisting[0], 0, true);
        expect(component.previousRowId).toEqual(0);
        component.setDesc([], {}, 0);
        expect(component.isdisabled).toBe(false);
        component.onClick([]);
        component.validateStartType([], 0);
        component.validateStartType('SUBSCRIPTION_RELATIVE', 0);
        component.validateStartType('NOT_SET', 0);
        component.validateEndType([], 0);
        component.validateEndType('SUBSCRIPTION_RELATIVE', 0);
        component.validateEndType('NOT_SET', 0);
        component.setStartDateOffset([], 0, true);
        component.setEndDateOffset([], 0, true);
        component.rateRow = component.rateSchedules[0];
        component.setRateSchedule();
        scheduleInfo.schedule.startDateType = 'EXPLICIT_DATE';
        scheduleInfo.schedule.endDateType = 'EXPLICIT_DATE';
        component.rateRow = scheduleInfo.schedule;
        component.setRateSchedule();
        scheduleInfo.schedule.startDateType = 'SUBSCRIPTION_RELATIVE';
        scheduleInfo.schedule.endDateType = 'SUBSCRIPTION_RELATIVE';
        component.rateRow = scheduleInfo.schedule;
        component.setRateSchedule();
    });
    it('should check start date warnings when date is past', () => {
        component.rateSchedules = [{startDateType: 'EXPLICIT_DATE'}];
        component.startDateValidations('Thu Aug 01 2019', '', 0, false);
        expect(component.startDateFuture).toBe(false);
        component.rateSchedules = [{startDateType: 'NEXT_BILL_PERIOD'}];
        component.startDateValidations('Thu Aug 01 2019', '', 0, false);
        expect(component.startDateFuture).toBe(false);
        expect(component.errorColumn).toEqual(0);
        component.closeWarningTooltip({}, 0);
        expect(component.startDateFuture).toBe(true);
    });
    it('should check end date warnings when date is past', () => {
        component.rateSchedules = [{endDateType: 'EXPLICIT_DATE'}];
        component.endDateValidations('Thu Aug 01 2019', '', 0, false);
        expect(component.endDateFuture).toBe(false);
        component.rateSchedules = [{endDateType: 'NEXT_BILL_PERIOD'}];
        component.endDateValidations('Thu Aug 01 2019', '', 0, false);
        expect(component.endDateFuture).toBe(false);
        expect(component.errorColumn).toEqual(0);
        component.closeWarningTooltip({}, 0);
        expect(component.endDateFuture).toBe(true);
    });
    it('should check start and end date validation on save', () => {
        component.rateSchedules = [{startDateType: 'NEXT_BILL_PERIOD'}];
        component.startDateValidations('Thu Aug 02 2019', {endDate: 'Thu Aug 01 2019'}, 0, true);
        expect(component.startDateFieldError).toBe(false);
        expect(component.errorColumn).toEqual(0);
    });
});
