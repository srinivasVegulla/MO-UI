import { AuthenticationService } from '.../../app/security/authentication.service';

import {
  MockBackend, RouterTestingModule, async, ComponentFixture, TestBed,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, BaseRequestOptions, Http, TranslationModule,
  utilService, UtilityService, ajaxUtilService, HttpHandler, tick,
  HttpClient, UrlConfigurationService, HttpClientTestingModule, fakeAsync,
  loadData, RouterModule, LocaleService, TranslationService, TranslationConfig, TranslationProvider,
  TranslationHandler, dateFormatPipe, LocaleConfig, LocaleStorage, showHidefunc, ReactiveFormsModule, FormsModule
} from '../../../assets/test/mock';

import { NgxAsideModule } from 'ngx-aside';
import { SecureHtmlPipe } from '../../helpers/secureHtml.pipe';
import { PopUpDrag } from '../../helpers/popUpDrag';
import { TextFilterPipe } from '../../helpers/textFilter.pipe';
import { CommonDialogComponent } from './common-dialog.component';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { showOperatorPipe } from '../../helpers/showOperator.pipe';
import { DateFormatPipe } from 'angular2-moment';

describe('CommonDialogComponent', () => {
  let component: CommonDialogComponent;
  let fixture: ComponentFixture<CommonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule,
        NgxAsideModule],
      declarations: [CommonDialogComponent, dateFormatPipe, DateFormatPipe],
      providers: [ajaxUtilService, UrlConfigurationService, BaseRequestOptions, MockBackend, DragulaService, UtilityService,
        HttpClient, TranslationService, TranslationConfig, TranslationProvider, TranslationHandler, utilService, dateFormatPipe,
        showOperatorPipe, DateFormatPipe, AuthenticationService, LocaleService, LocaleConfig, LocaleStorage,
        SecureHtmlPipe, PopUpDrag, TextFilterPipe,
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
    fixture = TestBed.createComponent(CommonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create CommonDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should open and close common dialog', () => {
    component.open = true;
    expect(component.visible).toBe(true);
    component.open = false;
    expect(component.visible).toBe(false);
    component.contentType = 'html';
    expect(component.setContentType).toEqual('html');
  });
  it('should check header, body and footer', () => {
    component.header = 'h1';
    expect(component.dialogHeader).toEqual('h1');
    component.body = 'b1';
    expect(component.dialogBody).toEqual('b1');
    component.footer = 'f1';
    expect(component.dialogFooter).toEqual('f1');
    component.noOfFooterButton = 2;
    expect(component.footerButtonCount).toEqual(2);
    component.defaultFooterButtons = true;
    expect(component.isDefaultFooterButtons).toBe(true);
    component.defaultFooterButtons = true;
    expect(component.isDefaultFooterButtons).toBe(true);
    component.closeOnEscape = true;
    expect(component.isCloseOnEscape).toBe(true);
    component.styleClass = 'class';
    expect(component.dialogStyleClass).toEqual('class');
    component.closeIcon = true;
    expect(component.isCloseIcon).toBe(true);
  });
  it('should check primary and default buttons', () => {
    const _textFilterPipe = fixture.debugElement.injector.get(TextFilterPipe);
    const _showOperatorPipe = fixture.debugElement.injector.get(showOperatorPipe);

    component.primaryButtons = 1;
    expect(component.primaryButtonSet).toEqual(1);
    component.primaryButtonSet = ['btn'];
    component.hasPrimaryBtn(0);
    component.modal = true;
    expect(component.isModal).toBe(true);
    component.escapeClose();
    expect(component.visible).toBe(false);
    component.closeDialog();
    expect(component.visible).toBe(false);
    component.show();
    expect(component.visible).toBe(true);
    component.safeHtml('sample');
    component.footerButtonClick(1);
    component.drag = true;
    expect(component.draggable).toBe(true);
    _textFilterPipe.transform(['item 1', 'item 2'], 'it');
    expect(_showOperatorPipe.transform('sample')).toEqual('');
  });
  it('should check drag element', () => {
    const _popUpDrag = fixture.debugElement.injector.get(PopUpDrag);
    _popUpDrag.dragElement(document.getElementById('sample'));
  });
});
