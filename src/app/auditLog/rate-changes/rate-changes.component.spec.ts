import { AuthenticationService } from '.../../app/security/authentication.service';

import {
    MockBackend, RouterTestingModule, async, ComponentFixture, TestBed, inject,
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, svcData,
    utilService, UtilityService, ajaxUtilService, RouterModule, HttpClient, HttpHandler, showOperatorPipe,
    TranslationModule, UrlConfigurationService, dateFormatPipe, LocaleService
} from '../../../assets/test/mock';
import { scheduleInfo } from '.../../assets/test/mock-schedule';
import { MockLocalService } from '../../../assets/test/mock-local-service';

import { RateChangesComponent } from './rate-changes.component';
import { AuditLogService } from '../auditLog.service';
import { InfiniteScrollCheckService } from '.../../app/helpers/InfiniteScrollCheck.service';
import { ApprovalService } from '.../../app/approval/approval.service';

describe('RateChangesComponent', () => {
    let component: RateChangesComponent;
    let fixture: ComponentFixture<RateChangesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule, TranslationModule.forRoot()],
            declarations: [RateChangesComponent],
            providers: [AuditLogService, ajaxUtilService, UtilityService, UrlConfigurationService,
                MockBackend, BaseRequestOptions, HttpClient, HttpHandler, utilService, dateFormatPipe,
                AuthenticationService, showOperatorPipe, InfiniteScrollCheckService, ApprovalService,
                { provide: LocaleService, useValue: MockLocalService },
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents().then(() => {
                fixture = TestBed.createComponent(RateChangesComponent);
                component = fixture.componentInstance;
                component.selectedAuditRecord = scheduleInfo.login;
                component.rateChangeConfig = scheduleInfo;
                component.rateChangeItems = [];
                component.param = component.selectedAuditRecord;
            });
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be initialized', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeDefined();
        component.ngOnInit();
    });
    it('should check rate fetching data', () => {
        component.param = component.selectedAuditRecord;
        component.reset();
        component.getRateChangesMetaData();
        expect(component.rateChangeFetching).toBe(false);
        expect(component.hasConfigData()).toBe(false);
    });
    it('should check rate header ', () => {
        component.rateChangeConfig = scheduleInfo;
        component.getScheduleHeader();
        component.rateChangeConfig = scheduleInfo.schedule;
        component.getRateSourceHeader1();
        component.rateChangeConfig = scheduleInfo;
        component.getRateSourceHeader1();
        component.getRateSourceHeader2();
        component.showRateChanges();
    });
    it('should check rate text by type ', () => {
        component.rateChangeConfig = scheduleInfo;
        component.getScheduleHeader();
        component.rateChangeConfig = scheduleInfo.schedule;
        component.getRateSourceHeader1();
        component.rateChangeConfig = scheduleInfo;
        component.getRateSourceHeader1();
        component.getRateSourceHeader2();
        component.showRateChanges();
        component.rateChanges = scheduleInfo.rateChangeItems;
        component.createRateTable(scheduleInfo.metaData);
        component.onAddRateTableClose(event);
        component.getRowClass(scheduleInfo.types[0], 1);
        component.getChangeTextByType(scheduleInfo.types[0]);
        component.getChangeTextByType(scheduleInfo.types[1]);
        component.getChangeTextByType(scheduleInfo.types[2]);
        component.setRateTableColumns('change', 'change',scheduleInfo.metaData);
        component.configRateTableRecord([scheduleInfo.ruleChangeData.change[0]], [], true);
        component.isRuleMiscproperties(1);
        component.storeOperators('int');
        component.getBooleanTextForViewMode('int', 'RCAmount');
        component.getOperator('EQUALS');
        component.metaDataAsPerRuleName = scheduleInfo.ruleChangeData.change[0];
        component.hasEnumData('change');
        component.metaDataAsPerRuleName = scheduleInfo.ruleChangeData.change[1];
        component.hasEnumData('change');
        component.hasEnumData('change1');
    });
    it('should check rate originalitems ', () => {
        component.hasOriginalItems(scheduleInfo.ruleChangeData.order);
        component.originalItems = scheduleInfo.ruleChangeData.index;
        component.isRuleChanged(scheduleInfo.ruleChangeData, scheduleInfo.ruleChangeData.col);
        component.metaDataAsPerRuleName = scheduleInfo.ruleChangeData.change[2];
        component.rateChangeConfig['metaData'] = scheduleInfo.ruleChangeData.change[2];
        component.getTableHeaderName(scheduleInfo.ruleChangeData.col);
        component.getTextFieldClass(scheduleInfo.ruleChangeData.col);
    });
    it('should pass rate changes information ', () => {
        const _auditLogService = fixture.debugElement.injector.get(AuditLogService);
        _auditLogService.getRateChanges(svcData);
        component.getLocaleDate(scheduleInfo.schedule.startDate);
        component.getRowClass(scheduleInfo.types[0], 0);
        component.getRowClass(scheduleInfo.types[1], 0);
        component.getRowClass(scheduleInfo.types[2], 0);
        component.rateChangeConfig['metaData'] = scheduleInfo.ruleChangeData.index;
        component.showRateChanges();
        scheduleInfo.ruleChangeData.index[0].dataType = 'boolean';
        component.rateChangeConfig['metaData'] = scheduleInfo.ruleChangeData.index;
        component.showRateChanges();
        component.conditions = scheduleInfo.conditions.conditions;
        component.createRateTable(scheduleInfo.metaData);
    });
});
