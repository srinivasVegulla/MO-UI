/**
 Use Case :
 HTML :
  1. For Window Scroll :
    * Can be use on any container in widget. Recommend to use immidiate parent element of scroll container.
    *
    <div ecb-infinite-scroller (scrollOnInit)="scrollInitialize()" (scrollGetMore)="getMoreData()"></div>
  2. For Element Scroll:
    * Use the directive where scroll is activated.
    *
    <div ecb-infinite-scroller (scrollOnInit)="scrollInitialize()" [scrollerContext]="'self'" (scrollGetMore)="getMoreData()"></div>
*  Callbacks: 
*   scrollOnInit: To Initialize Pagination. have attributes [page, size]
*   scrollGetMore: Trigger the function when scroller reach to end
*  Proprties:
*   scrollerContext: Scroller context , either self or window
*   scrollSize: Provide each page size
*/
import { Directive, Input, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';
import { utilService } from '../helpers/util.service';
import { InfiniteScrollCheckService } from '../helpers/InfiniteScrollCheck.service';

export type scrollerContext = 'self' | 'window';

export interface Pagination {
  page: number;
  size: number;
  initSize: number;
  scrollPageSize: number;
  next: any;
  previous: any;
};

export interface ContextViewport {
  height: number;
  width: number;
};

@Directive({
    selector: '[ecb-infinite-scroller]'
})
export class InfiniteScrollDirective implements OnInit {
    ele: any;
    contextViewport: ContextViewport;
    canGetMore: boolean;
    canGetLess: boolean;
    pagination: Pagination;
    BUFFER_THRESHOLD;
    MAX_THRESHOLD;
    MORE_INDEX;
    DELETE_INDEX;
    PAGE_SIZE; // As per API Implementation BUFFER_THRESHOLD and page size should same
    viewPortHeight;
    currentScrollTop: number;
    modifiedScrollPosition: any;
    gridCount: any;
    pageCount;

    @Input() scrollerContext: scrollerContext = 'window';

    @Input() set scrollSize(p) {
      this.PAGE_SIZE = p;
    }

    //Remove this after applying Long Listing to Localization Component
    @Input() localizationPageSize : any;

    @Output() scrollGetMore: EventEmitter<any> = new EventEmitter();

    @Output() scrollGetLess: EventEmitter<any> = new EventEmitter();

    @Output() scrollOnInit: EventEmitter<any> = new EventEmitter();

    @HostListener('scroll', ['$event']) onElementScroll() {
        if (this.scrollerContext === 'self') {
            if (this.elementEndReachedInSelfScrollbarContext() && this.canGetMore) {
                    this.getMoreData();
            } else if (this.elementEndReachedInSelfScrollbarContext() && this.canGetLess) {
                    this.getLessData();
            }
        }
    }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 20) {
        this.getMoreData();
      }
    }

    constructor(private element: ElementRef,private _utilService: utilService,private _infiniteService: InfiniteScrollCheckService) {
        this.viewport();
        this.pagination = this.getPaginationData();
        this.canGetMore = true;
        this.ele = element.nativeElement;
        this.contextViewport = this.getContextViewport(window);
    }

    ngOnInit() {
        this.scrollOnInit.emit(this.pagination);
        if (this.scrollerContext === 'window') {
            document.addEventListener('scroll', () => {
                if (this.elementEndReachedInDocumentScrollbarContext(window, this.ele) && this.canGetMore) {
                  this.getMoreData();
                }
            });
        }
        this._utilService.changeScrollPosition.subscribe(value => {
            if (value !== null && value !== undefined) {
                if(value === 'Less'){
                    this.ele.scrollTop = 85;
                } else if (value === 'modified') {
                    this.ele.scrollTop = this.modifiedScrollPosition;
                } else if (value === 'refresh') {
                    this.ele.scrollTop = 0;
                }
            }
        });
        this._utilService.scrollHeight.subscribe(value => {
            if(value) {
                this.modifiedScrollPosition = this.ele.scrollTop;
            } else {
                this.modifiedScrollPosition = 45;
            }
        });
    }

    viewport() {
        if (typeof window.innerWidth !== 'undefined') {
            this.viewPortHeight = window.innerHeight;
        } else if (typeof document.documentElement !== 'undefined'
            && typeof document.documentElement.clientWidth !==
            'undefined' && document.documentElement.clientWidth !== 0) {
            this.viewPortHeight = document.documentElement.clientHeight;
        }
            this.BUFFER_THRESHOLD = this.viewPortHeight > 1627 ? 50 : 25;
            this.MAX_THRESHOLD = this.viewPortHeight > 1627 ? 150 : 75;
            this.MORE_INDEX = this.viewPortHeight > 1627 ? 100 : 50;
        this.DELETE_INDEX = this.viewPortHeight > 1627 ? 49 : 24;
            this.PAGE_SIZE = this.BUFFER_THRESHOLD;
    }

    getPaginationData() {
      if (this.ele && this.ele.scrollTop) {
        this.ele.scrollTop = 0;
      }
      return {
        page: 1,
        size: this.PAGE_SIZE,
        initSize: this.BUFFER_THRESHOLD,
        maxSize: this.MAX_THRESHOLD,
        moreIndex: this.MORE_INDEX,
        deleteIndex: this.DELETE_INDEX,
        scrollPageSize: this.getScrollPageSize(),
        firstPageIndex: 1,
        centerPageIndex: null,
        lastPageIndex: null,
        next: () => {
          this.pagination.page += 1;
          this.pagination.scrollPageSize = this.getScrollPageSize();
        },
        previous: () => {
          this.pagination.page -= 1;
          this.pagination.scrollPageSize = this.getScrollPageSize();
        },
        reset: () => {
          this.pagination = this.getPaginationData();
          return this.pagination;
        }
      };
    }

    getScrollPageSize() {
      return this.pagination === undefined || this.pagination.page === 1 ? this.BUFFER_THRESHOLD : this.PAGE_SIZE;
    }

    getMoreData() {
        this.currentScrollTop = this.ele.scrollTop;
        this.canGetMore = false;
        this.scrollGetMore.emit(this.pagination);
    }

    getLessData() {
        this.canGetLess = false;
        this.scrollGetLess.emit(this.pagination);
    }

    elementEndReachedInSelfScrollbarContext(): boolean {
        if (this.ele.scrollTop + this.ele.offsetHeight >= this.ele.scrollHeight - 20) {
             if (this.localizationPageSize !== undefined && 
                (this._infiniteService.totalPages === undefined || this._infiniteService.totalPages === 0 )) {
                if (this.pagination.page !== this.localizationPageSize) {
                    this.canGetMore = true;
                    this.ele.scrollTop = this.ele.scrollTop - 200;
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this._infiniteService.totalPages !== undefined && this.pagination.page !== this._infiniteService.totalPages) {
                    this.canGetMore = true;
                    this.ele.scrollTop = this.ele.scrollTop - 200;
                    return true;
                } else {
                    return false;
                }
            }
        } else if (this.ele.scrollTop <= 20) {
            if (this.pagination.page > 1) {
                this.canGetLess = true;
                return true;
            } else {
                return false;
            }
        }
    }

    elementEndReachedInDocumentScrollbarContext(win: Window, ele: any): boolean {
        const rect = ele.getBoundingClientRect();
        const elementTopRelativeToContextViewport = rect.top;
        const elementTopRelativeToDocument = elementTopRelativeToContextViewport + win.pageYOffset;
        const scrollableDistance = ele.offsetHeight + elementTopRelativeToDocument;
        const currentPos = win.pageYOffset + this.contextViewport.height;

        if (currentPos > scrollableDistance) {
            this.canGetMore = true;
            return true;
        }

        return false;
    }

    private getContextViewport(win: Window): ContextViewport {
        if (win.innerWidth != null) {
            return {
                width: win.innerWidth,
                height: win.innerHeight
            };
        }
        const document = win.document;
        if (document.compatMode == 'CSS1Compat') {
            return {
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight
            };
        }
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight
        };
    }
}
