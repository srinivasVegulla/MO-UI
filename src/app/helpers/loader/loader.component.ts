/**
 * Introduction:
 * =============
 * Loader is a reusable component with two modes of loaders(dot & skeleton). Dot style can be implemented on the whole page(fill = page) and on widget(fill = widget) whereas skeleton is on widget(fill = widget) & grid(fill = grid). Skeleton loader has different types of styles like 'widgetSkeleton', 'localizationWidgetSkeleton' which can be achieved using type property(type=localization)
 *
 * Implementation guide :
 * ====================
 * Dot Loader template
 * --------------------
 * <ecb-loader mode="dot" fill="widget" [styling]="loaderStyle" backDropClassName="ecb-loaderMinHeight" loaderClassName="ecb-loaderStyle"></ecb-loader>
 *
 * Skeleton Loader template
 * ------------------------
 * <ecb-loader mode="skeleton" fill="widget" type="localization" [styling]="loaderStyle" backDropClassName="ecb-loaderMinHeight" loaderClassName="ecb-loaderStyle"></ecb-loader>
 *
 * Input properties:
 * =================
 *
 * => mode : dot/skeleton - display mode of Loader
 * => fill : page/widget/grid - Loader coverage area
 * => type : Not required for Dot loader, For Skeleton use below
 *           if {{fill = grid}} then to get style as
 *           gridSkeleton ==> type : grid,
 *           offeringsSkeleton ==> type : offerings,
 *           localizationWidgetSkeleton ==> type : localization
 *
 *           if {{fill = widget}} then to get style as
 *           widgetSkeleton ==> type : widget,
 *           propertiesSkeleton ==> type : properties,
 *           permissionSkeleton ==> type : permission,
 *           extendedPropertiesSkeleton ==> type : extendedProperties,
 *           priceableItemsSkeleton ==> type : priceableItems,
 *           localizationWidgetSkeleton ==> type : localization
 *
 * => styling : '{"margin-top": "5px"}' - To style only backdrop, only for unique and single style
 * => backDropClassName : your class name - Add class to backdrop
 * => loaderClassName : your class name - Add class to loader container
 *
 * Any new styling for skeleton add that to ngClass available in the loader template.
 *
 * Dev Contact : Yajuteja
 *
 */


import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from './loader.service';

@Component({
    selector: 'ecb-loader',
    templateUrl: 'loader.component.html'
})

export class LoaderComponent implements OnInit {

    showDotLoader = false;
    styleObject: any
    @Input() mode;
    @Input() fill;
    @Input() type;
    @Input() public set styling(value) {
        this.styleObject = JSON.parse(value);
    }
    @Input() backDropClassName;
    @Input() loaderClassName;
    private loaderSubscriptions: Subscription;

    constructor(private readonly _loaderService: LoaderService) { }

    ngOnInit() {
        this.loaderSubscriptions = this._loaderService.displayDotLoader.subscribe(value => {
            this.showDotLoader = value.show;
        });
    }

    getClassName (item) {
        switch (item) {
            case 'backdrop':
                if (this.backDropClassName !== undefined && this.backDropClassName !== '') {
                    return this.backDropClassName;
                }
                break;
            case 'loader':
                if (this.loaderClassName !== undefined && this.loaderClassName !== '') {
                    return this.loaderClassName;
                }
                break;
            default:
                break;
        }
    }

    ngOnDestroy() {
        this.loaderSubscriptions.unsubscribe();
    }
}
