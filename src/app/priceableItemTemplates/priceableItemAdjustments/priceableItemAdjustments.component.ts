import { Component, EventEmitter, ViewChild, OnInit, Input, Output, HostListener } from '@angular/core';
import { PriceableItemAdjustmentsService } from './priceableItemAdjustments.service';
import { UtilityService } from '../../helpers/utility.service';
import { Language, TranslationService } from 'angular-l10n';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { utilService } from '../../helpers/util.service';
import { ActivatedRoute, Router, CanDeactivate, NavigationStart } from '@angular/router';
import { CapabilityService } from '../../helpers/capabilities.service';
import { PiTemplateDetailsService } from '../piTemplateDetails/piTemplateDetails.service';
import { priceableItemDetailsService } from '../../priceableItemDetails/priceableItemDetails.service';

@Component({
    selector: 'ecb-priceableItem-adjustments',
    templateUrl: './priceableItemAdjustments.component.html',
    providers: []
})

export class PriceableItemAdjustmentComponent implements OnInit {
    @ViewChild('adjustmentsResons') adjustmentsResons;
    @Language() lang: string;
    adjustmentDetails: any;
    adjustmentsDetailsList: any;
    adjustmentDetailsLength: any;
    saveRulesError = false;
    cols: any[];
    columnDef;
    defaultAdjustment: any;
    adjustmentsTypesList: any;
    adjustmentsReasonsList: any;
    adjustmentsReasonsNamesList: any;
    adjustmentsTypesNameList: any;
    names: any;
    addTooltip;
    deleteTooltip;
    newAdjustment: any;
    newAdjustmentLength: any;
    adjustmentsTypesLength: any;
    canAddNewAdjustment: boolean;
    selectedAdjustmentName: any;
    selectedAdjustmentDescription: any;
    newAdjustmentsDetailsList: any;
    isReasonSelected: any;
    selectedReasonId: any;
    reasonsIdContainer: any;
    reasonIndex: any;
    @ViewChild('chevron') chevron: any;
    showOptions = false;
    isChevronClicked: boolean;
    noAdjustments: boolean;
    kind;
    selectedPriceableItem: any;
    piId: number;
    templateId: number;
    removeAdjustmentfromUI: boolean = false;
    removeAdjustmentID;
    isDeleteAdjError: boolean = false;
    deleteAdjError: string = '';
    reasonsDropdownIndex: number;
    showAdjustmentNames = false;
    adjNamesIndex: number;
    isAdjNamesClicked: boolean;
    addReasonsToSelectedAdj: any;
    adjNameIndex: any;
    reasonErrorMessage: any;
    confirmDialog: number;
    selectedAdjustmentReason: any;
    selectedAdjustmentReasonLength: any;
    alreadyAddedAdjRemove: any;
    adjNamesIdToString: any;
    filterQuery;
    ifEditedConfirmDialog: any;
    isSaveEnabled: boolean;
    @Output() isFormDirty = new EventEmitter();
    @Output() isPITemplateUpdated = new EventEmitter();
    deleteAdjustmentId: number;
    deleteAdjustmentIndex: number;
    deletingAdjustment: any;
    showCover: boolean;
    noReasonCodes: boolean;
    newAdjustmentReasons: number;
    isPriceableItemTemplate: boolean;
    isPIInstance: boolean;
    eventCheck: any;
    finalAdjArray: any;
    listHeight: any;
    adjustNames: any;
    adjustDropDownList: any;
    cellHeightList: any;
    modalDialogClose;
    loadGridData: any;
    loading: boolean;
    editAdjustmentCapability = true;
    showDotLoader = false;
    showSkeleton = false;
    isAdjustmentsUpdated = false;
    piTemplateDetailSubscribe;
    httpErrorMessage: string = '';
    httpError: boolean = false;

    @HostListener('document:click', ['$event'])
    function(event) {
        const e = event;
        if (e.target.className.includes('ecb-adjNamesIcon') ||
            e.target.className.includes('ecbReasonCheck') ||
            e.target.className.includes('adjustmentNames') ||
            e.target.className.includes('ecb-droplisttextarea') ||
            e.target.className.includes('ui-clickable') ||
            e.target.className.includes('ui-dropdown-trigger')) {
        } else {
            /*Adjustment reasons dropdown field handling */
            this.showOptions = false;
            this.isAdjNamesClicked = false;
            this.isChevronClicked = false;
            /*Adjustment names dropdown field handling */
            this.showAdjustmentNames = false;
        }
    }

    @HostListener('window:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 27 &&  this._utilityService.isObject(this.adjustmentsResons)) {
            if (this.ifEditedConfirmDialog === 0 && this.confirmDialog === 0 && this.adjustmentsResons.visibleStatus) {
                this.cancelCoverHandler();
            } else {
                this.ifEditedConfirmDialog = 0;
                this.confirmDialog = 0;
            }
        }
    }

    @Input() set isPItemplate(value) {
        this.isPriceableItemTemplate = value;
    }

    @Input() set piAdjustments(selectedPITemplate) {
        this.selectedPriceableItem = selectedPITemplate;
        this.priceableItemCheck();
        this.getAdjustmentsReasons();
        this.getDefaultAdjustments();
        this.getPIAdjustmentsTypeNames();
    }

    constructor(private _piAdjustmentsService: PriceableItemAdjustmentsService,
        private _utilityService: UtilityService,
        private _utilService: utilService,
        private _translationService: TranslationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _capabilityService: CapabilityService,
        private _piTemplateDetailsService: PiTemplateDetailsService,
        private _priceableItemDetailsService: priceableItemDetailsService) {
        this.addTooltip = this._translationService.translate('TEXT_ADD');
        this.deleteTooltip = this._translationService.translate('TEXT_DELETE');
        this.reasonErrorMessage = this._translationService.translate('TEXT_NO_REASONS_SELECTED');
        this.newAdjustment = [];
        this.reasonsIdContainer = [];
        this.confirmDialog = 0;
        this.ifEditedConfirmDialog = 0;
        this.alreadyAddedAdjRemove = [];
        this.isSaveEnabled = true;
        this.newAdjustmentsDetailsList = [];
        this.adjustNames = [];
        this.listHeight = ['45'];
        this.cellHeightList = { 0: [0, 0, 0, 0] }
    }

    ngOnInit() {
        this.getGridConfigData();
        if (!this.isPriceableItemTemplate) {
            this.editAdjustmentCapability = this._capabilityService.findPropertyCapability('UIPIDetailsPage', 'Adjustments_Edit');
        }
        this.kind = this._route.snapshot.params['kind'];
        this.filterQuery = {};
        this._utilService.setHeight.subscribe(value => {
            setTimeout(() => {
                let index = Object.keys(value)[0];
                const heightObject = value[index];
                if (this.cellHeightList[index] === undefined) {
                    this.cellHeightList[index] = [0, 0, 0, 0];
                }
                const rowHeightsArray = this.cellHeightList[index];
                let cellIndex = Object.keys(heightObject)[0];
                rowHeightsArray[cellIndex] = heightObject[cellIndex];
                const newHeight = this.getMaxOfArray(rowHeightsArray);
                this.listHeight[index] = newHeight;
            }, 100);
        });
    }

    getGridConfigData() {
        this._utilityService.getextdata({
          data: 'piAdjustmentsColumnDef.json',
          success: (result) => {
            this.columnDef = result;
            this.defaultAdjustment = this.columnDef.Adjustments;
            this.cols = this.columnDef.cols;
            this.loadGridData = true;
          },
          failure: (error) => {
            //this.inUseSubscribersError = error;
            this.loadGridData = false;
          }
        });
      }

    identify(index) {
        return index;
    }

    getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    getlistHeight(index) {
        return { 'height': this.listHeight[index] + "px", 'overflow': 'hidden' };
    }

    resetHeight(array, index) {
        const newHeight = this.getMaxOfArray(array);
        this.listHeight[index] = newHeight;
    }

    /* To know whether it the selected PI is template or instance */
    priceableItemCheck() {
        if (this.isPriceableItemTemplate) {
            this.piId = this.selectedPriceableItem.piId;
            this.templateId = +this._route.snapshot.params['templateId'];
            this.isPIInstance = false;
        } else {
            this.piId = this.selectedPriceableItem.itemTypeId;
            this.templateId = +this._route.snapshot.params['itemInstanceId'];
            this.isPIInstance = true;
        }
    }

    /*getting All the AdjustmentReasons*/
    getAdjustmentsReasons() {
        this.adjustmentsReasonsNamesList = [];
        this.showDotLoader = true;
        const widgetData = {
            param: {
                page: 1,
                size: 9999
            }
        };
        this._piAdjustmentsService.getAdjustmentsReasons({
            data: widgetData,
            success: (result) => {
                this.adjustmentsReasonsList = result.records;
                Object.keys(this.adjustmentsReasonsList).forEach(element => {
                    const reasons = {
                        label: this.adjustmentsReasonsList[element].name,
                        value: this.adjustmentsReasonsList[element].propId
                    };
                    this.adjustmentsReasonsNamesList.push(reasons);
                });
                this.setAdjustMentList();
            },
            failure: (errorMsg: string, code: any, error: any) => {
                this.handleAdjError(code, errorMsg, 'LOAD');
            },
            onComplete : () => {
                this.showDotLoader = false;
            }
        });
    }

    /* getting all the AdjustmentTypes*/
    getPIAdjustmentsTypeNames() {
        this.showDotLoader = true;
        this.adjustmentsTypesNameList = [];
        this._piAdjustmentsService.getPiAdjustments({
            data: this.piId,
            success: (result) => {
                this.adjustmentsTypesList = result.records;
                this.adjustmentsTypesLength = this.adjustmentsTypesList.length;
            },
            failure: (errorMsg: string, code: any, error: any) => {
                this.handleAdjError(code, errorMsg, 'LOAD');
            },
            onComplete: () => {
                this.showDotLoader = false;
            }
        });
    }

    getDefaultAdjustments() {
        this.isAdjustmentsUpdated === true ? this.showSkeleton = true : this.loading = true;
        this.newAdjustmentsDetailsList = [];
        const defaultData = {
            TemplateId: this.templateId,
            isPIInstance: this.isPIInstance
        }
        this._piAdjustmentsService.getDefaultAdjustments({
            data: defaultData,
            success: (result) => {
                this.isDeleteAdjError = false;
                this.newAdjustment = result;
                this.newAdjustmentLength = this.newAdjustment.length;
                this.removeAdjustmentfromUI = true;
                if (this.newAdjustmentLength > 0) {
                    this.noAdjustments = false;
                    Object.keys(this.newAdjustment).forEach(element => {
                        const adjDetails = {
                            displayName: this.newAdjustment[element].displayName,
                            value: this.newAdjustment[element].propId,
                            reasonCount: this.newAdjustment[element].reasonCodes.length
                        };
                        this.newAdjustment[element]['deleteCheck'] = false;
                        this.newAdjustmentsDetailsList.push(adjDetails);
                    });
                } else {
                    this.noAdjustments = true;
                    this.addNewAdjustment();
                }
                if (this.adjustmentsTypesLength === this.newAdjustmentLength) {
                    this.canAddNewAdjustment = false;
                } else {
                    this.canAddNewAdjustment = true;
                }
            },
            failure: (errorMsg: string, code: any, error: any) => {
                this.isDeleteAdjError = true;
                this.deleteAdjError = this._utilityService.errorCheck(code, errorMsg, 'LOAD');
            },
            onComplete: () => {
                this.loading = false;
                this.isAdjustmentsUpdated = false;
                setTimeout(() => {
                    this.showSkeleton = false;
                }, 500);
            }
        });
    }

    /* deleting adjustments from DB*/
    deleteSelectedAdjustments(adjPropId) {
        this.showSkeleton = true;
        this.isAdjustmentsUpdated = true;
        this.deleteAdjustmentId = adjPropId;
        this._piAdjustmentsService.deleteAdjustments({
            data: this.deleteAdjustmentId,
            success: (result) => {
                this.getDefaultAdjustments();
            },
            failure: (errorMsg: string, code: any) => {
                this.handleAdjError(code, errorMsg, 'DELETE');
            },
            onComplete: () => {

                this.isAdjustmentsUpdated = false;
                setTimeout(() => {
                    this.showSkeleton = false;
                }, 500);
            }
        });
    }

    onEnterSaveChecks(event) {
    if (event.keyCode === 13 && !event.shiftKey && !this.isSaveEnabled) {
        this.saveChecks();
        }
    }

    saveChecks() {
        this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
        this.newAdjustmentLength = this.newAdjustment.length;
        for (let i = 0; i < this.newAdjustmentLength; i++) {
            if (this.newAdjustment[i].adjustmentTypeId === null) {
                this.newAdjustment.splice(i, 1);
                this.noReasonCodes = false;
            } else {
                if (this.newAdjustment[i].deleteCheck) {
                    this.newAdjustment[i]['adjustmentTypeId'] = this.newAdjustment[i].propId;
                    this.newAdjustment[i]['itemTemplateId'] = this.templateId;
                    this.newAdjustment[i]['propId'] = null;
                    this.newAdjustment[i]['deleteCheck'] = false;
                }
                this.newAdjustmentReasons = this.newAdjustment[i].reasonCodes.length;
                if (this.newAdjustmentReasons >= 1) {
                    this.noReasonCodes = false;
                } else {
                    this.noReasonCodes = true;
                    break;
                }
            }
        }
        if (!this.noReasonCodes) {
            this.saveAdjustments();
        }
    }

    saveAdjustments() {
        this.isSaveEnabled = true;
        this.showOptions = false;
        this.isAdjustmentsUpdated = true;
        this.httpError = false;
        const widgetData = {
            ItemTemplateId: this.templateId,
            isPIInstance: this.isPIInstance,
            body: this.newAdjustment
        };
        this._piAdjustmentsService.createNewAdjustments({
            data: widgetData,
            success: (result) => {
                if(this.isPItemplate) {
                    this.isPITemplateUpdated.emit('PIAdjustments');
                }
                this.closeAdjustmentsSidePanel();
                this.getDefaultAdjustments();
            },
            failure: (errorMsg: string, code: any, error: any) => {
                this.handleAdjError(code, errorMsg, 'EDIT');
            }
        });
    }

    /*Without adding reason saving error tooltip close*/
    onToolTipClose() {
        this.noReasonCodes = false;
    }

    /*onclicking of X mark in adjustment widget 
    in PI template details view */
    openDeleteConfirmation(adjPropId) {
        this.removeAdjustmentID = adjPropId;
        this.removeAdjustmentfromUI = false;
    }

    /*error message when deleting failed in 
    adjustment widget in PI template details view */
    handleAdjError(code, errorMsg, type) {
        if (type === 'EDIT') {
            this.httpError = true;
            this.httpErrorMessage = this._utilityService.errorCheck(code, errorMsg, type);
        } else {
            this.isDeleteAdjError = true;
            this.deleteAdjError = this._utilityService.errorCheck(code, errorMsg, type);
        }
    }

    /*To close the error dialog when deleting failed in 
    adjustment widget in PI template details view */
    deleteErrorMessage() {
        this.isDeleteAdjError = false;
        this.removeAdjustmentID = -1;
    }

    /*close delete card in adjustment widget
    in PI template details view*/
    cancelAdjDeleteCard() {
        this.removeAdjustmentID = -1;
    }

    openAdjustmentsSidePanel() {
        this.newAdjustment = null;
        this.isSaveEnabled = true;
        this.getDefaultAdjustments();
        this.createAdjustments();
        this.adjustmentsResons.show();
        this.showCover = true;
        this._utilService.checkNgxSlideModal(true);
    }

    closeAdjustmentsSidePanel() {
        this.adjustmentsResons.hide();
        this.showCover = false;
        this.showOptions = false;
        this.isFormDirty.emit(false);
        this._utilService.checkNgxSlideModal(false);
        this.modalDialogClose = false;
    }

    /*Making the AdjustmentNames input to Textarea of Dropdown*/
    isAlreadyAddedAdj(adj, index) {
        this.newAdjustmentLength = this.newAdjustment.length;
        if (this.newAdjustmentLength > 0 && adj !== null) {
            if (adj.reasonCodes !== undefined) {
                if (adj.adjustmentTypeId !== null && (adj.adjustmentTypeId === this.newAdjustment[index].adjustmentTypeId)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (adj.propId !== null && (adj.propId === this.newAdjustment[index].propId)) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    createAdjustments() {
        for (let i = 0; i < this.newAdjustmentLength; i++) {
            if (this.newAdjustmentLength === this.adjustmentsTypesLength) {
                this.canAddNewAdjustment = false;
                this.selectAdjustmentsNames();
            } else if (this.newAdjustmentLength < this.adjustmentsTypesLength) {
                this.canAddNewAdjustment = true;
                this.selectAdjustmentsNames();
            }
        }
    }

    selectAdjustmentsNames() {
        this.loading = true;
        this.alreadyAddedAdjRemove = [];
        this.finalAdjArray = [];
        this.filterQuery = {};
        this.adjustmentsTypesNameList = [];
        for (let i = 0; i < this.newAdjustmentLength; i++) {
            if (this.newAdjustment != null) {
                if (!this.newAdjustment[i].deleteCheck && this.newAdjustment[i].adjustmentTypeId !== null) {
                    this.alreadyAddedAdjRemove.push(this.newAdjustment[i].adjustmentTypeId);
                } else if (this.newAdjustment[i].deleteCheck && this.newAdjustment[i].adjustmentTypeId !== null) {
                    this.alreadyAddedAdjRemove.push(this.newAdjustment[i].propId);
                }
            }
        }
        this.adjNamesIdToString = this.alreadyAddedAdjRemove.toString();
        if (!this._utilityService.isEmpty(this.adjNamesIdToString)) {
            this.finalAdjArray.push(this.adjNamesIdToString);
        }
        if (this.piId) {
            this.filterQuery['itemTypeId'] = this.piId;
        }
        if (!this._utilityService.isEmpty(this.finalAdjArray)) {
            this.filterQuery['propId'] = `(${this.finalAdjArray})|out`;
        }
        const widgetData = {
            param: {
                query: this.filterQuery
            }
        }
        this._piAdjustmentsService.getPiAdjustmentsTypesToBeAdded({
            data: widgetData,
            success: (result) => {
                this.adjustmentsTypesNameList = result.records;
                this.loading = false;
                this.setAdjustMentList();
            },
            failure: (errorMsg: string, code: any, error: any) => {
                this.handleAdjError(code, errorMsg, 'LOAD');
            }
        });
        this.adjustmentsTypesNameList = JSON.parse(JSON.stringify(this.adjustmentsTypesNameList));
    }

    showReasonsList(index) {
        this.reasonsDropdownIndex = index;
        this.toggleDropdownDom();
    }

    toggleDropdownDom() {
        this.isChevronClicked = this.isChevronClicked ? false : true;
        if (this.isChevronClicked) {
            this.showOptions = true;
        } else {
            this.showOptions = false;
        }
    }

    showAdjNamesList(index) {
        this.adjNamesIndex = index;
        this.createAdjustments();
        this.isAdjNamesClicked = this.isAdjNamesClicked ? false : true;
        if (this.isAdjNamesClicked) {
            this.showAdjustmentNames = true;
        } else {
            this.showAdjustmentNames = false;
        }
    }

    isAdjustmentReasonEnabled(adjustment) {
        if (adjustment.adjustmentTypeId === null) {
            return true;
        } else {
            return false;
        }
    }

    /* adding a dummy row to the grid */
    addNewAdjustment() {
        if (this.defaultAdjustment !== undefined) {
            this.isSaveEnabled = false;
            this.adjustNames = [];
            this.newAdjustment.push(this.defaultAdjustment);
            this.newAdjustmentLength = this.newAdjustment.length;
            this.cellHeightList[this.newAdjustmentLength] = [0, 0, 0, 0];
            this.resetHeight(this.cellHeightList[this.newAdjustmentLength], this.newAdjustmentLength);
            this.getlistHeight(this.newAdjustmentLength);
            this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
            this.createAdjustments();
            if (this.adjustmentsTypesLength === parseInt (this.newAdjustmentLength)) {
                this.canAddNewAdjustment = false;
            } else {
                this.canAddNewAdjustment = true;
            }
        }
    }

    /* select Adjustment from the AdjustmentTypes dropdown*/
    changeSelectedAdjustment(index) {
        if (this.adjustmentsTypesLength === 0) {
            this.getPIAdjustmentsTypeNames();
        if (this.adjustmentsTypesNameList) {
            this.adjustmentSelectionProcessing(index);
            this.selectAdjustmentsNames();
        }
        } else {
        if (this.adjustmentsTypesNameList) {
            this.adjustmentSelectionProcessing(index);
            this.selectAdjustmentsNames();
        }
        }
    }

    adjustmentSelectionProcessing(index){
        const selectAdjustTypeIndex = this.adjustNames[index];
        if (selectAdjustTypeIndex === -1) {
            return false;
        };
        const adjustment = this.adjustmentsTypesNameList[selectAdjustTypeIndex];
        this.isSaveEnabled = false;
        this.isFormDirty.emit(true);
        this.adjNameIndex = this.reasonsIdContainer.indexOf(selectAdjustTypeIndex);
        adjustment['reasonCodes'] = [];
        adjustment['deleteCheck'] = true;
        this.newAdjustment.splice(index, 1, adjustment);
        this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
        this.newAdjustmentLength = this.newAdjustment.length;
        this.isAlreadyAddedAdj(adjustment, index);
    }
    /*remove adjustment from the grid in the UI side */
    removeAdjustment(adjustmentIndex) {
        this.isSaveEnabled = false;
        this.isFormDirty.emit(true);
        this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
        this.newAdjustmentLength = this.newAdjustment.length;
        if (this.newAdjustmentLength === 1) {
            this.newAdjustment.splice(adjustmentIndex, 1);
            this.addNewAdjustment();
            this.selectAdjustmentsNames();
            this.isAlreadyAddedAdj(this.defaultAdjustment, adjustmentIndex);
            this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
        } else {
            this.newAdjustment.splice(adjustmentIndex, 1);
            this.canAddNewAdjustment = true;
            this.isAlreadyAddedAdj(this.defaultAdjustment, adjustmentIndex);
            this.newAdjustment = JSON.parse(JSON.stringify(this.newAdjustment));
        }
        delete this.cellHeightList[adjustmentIndex];
    }

    /*adding the AdjustmentReasons to the selected AdjustmentType*/
    selectReasons(reasonObj, event, selectedAdj) {
        this.eventCheck = event || window.event;
        if (this.eventCheck.target !== undefined) {
            this.isReasonSelected = this.eventCheck.target.checked;
        } else if (this.eventCheck.srcElement !== undefined) {
            this.isReasonSelected = this.eventCheck.srcElement.checked;
        } else {
            this.isReasonSelected = this.eventCheck.target.checked || this.eventCheck.srcElement.checked;
        }
        this.selectedReasonId = reasonObj.propId;
        this.addReasonsToSelectedAdj = selectedAdj;
        this.newAdjustmentLength = this.newAdjustment.length;
        if (this.isReasonSelected) {
            this.isSaveEnabled = false;
            this.isFormDirty.emit(true);
            for (let i = 0; i < this.newAdjustmentLength; i++) {
                if (this.newAdjustment[i].deleteCheck) {
                    if (this.newAdjustment[i].propId === this.addReasonsToSelectedAdj.propId) {
                        this.newAdjustment[i].reasonCodes.push(reasonObj);
                    }
                } else {
                    if (this.newAdjustment[i].adjustmentTypeId === this.addReasonsToSelectedAdj.adjustmentTypeId) {
                        this.newAdjustment[i].reasonCodes.push(reasonObj);
                    }
                }
            }
        } else if (!this.isReasonSelected) {
            this.isSaveEnabled = false;
            this.isFormDirty.emit(true);
            for (let i = 0; i < this.newAdjustmentLength; i++) {
                if (this.newAdjustment[i].deleteCheck) {
                    if (this.newAdjustment[i].propId === this.addReasonsToSelectedAdj.propId) {
                        this.selectedAdjustmentReason = this.newAdjustment[i].reasonCodes;
                        this.selectedAdjustmentReasonLength = this.selectedAdjustmentReason.length;
                        for (let j = 0; j < this.selectedAdjustmentReasonLength; j++) {
                            if (this.selectedReasonId === this.selectedAdjustmentReason[j].propId) {
                                this.reasonIndex = this.selectedAdjustmentReason.indexOf(this.selectedAdjustmentReason[j]);
                            }
                        }
                        this.newAdjustment[i].reasonCodes.splice(this.reasonIndex, 1);
                    }
                } else {
                    if (this.newAdjustment[i].adjustmentTypeId === this.addReasonsToSelectedAdj.adjustmentTypeId) {
                        this.selectedAdjustmentReason = this.newAdjustment[i].reasonCodes;
                        this.selectedAdjustmentReasonLength = this.selectedAdjustmentReason.length;
                        for (let j = 0; j < this.selectedAdjustmentReasonLength; j++) {
                            if (this.selectedReasonId === this.selectedAdjustmentReason[j].propId) {
                                this.reasonIndex = this.selectedAdjustmentReason.indexOf(this.selectedAdjustmentReason[j]);
                            }
                        }
                        this.newAdjustment[i].reasonCodes.splice(this.reasonIndex, 1);
                    }
                }
            }
        }
    }

    /*open delete modalpopup in aside panel if deletecheckflag is true*/
    openAdjAsideDeleteConfirmation(adjustment, adjustmentIndex) {
        if (!adjustment.deleteCheck && (adjustment.deleteCheck !== undefined && adjustment.deleteCheck !== null)) {
            this.confirmDialog = 1;
            this.deletingAdjustment = adjustment;
            this.deleteAdjustmentIndex = adjustmentIndex;
        } else {
            this.removeAdjustment(adjustmentIndex);
        }
    }

    /*delete modalpopup in aside panel close*/
    onModalDialogCloseDelete(event) {
        if (this.confirmDialog === 1) {
            this.confirmDialog = 0;
            this.modalDialogClose = !this.modalDialogClose;
        }
        if (event.index === 1) {
            this.removeAdjustment(this.deleteAdjustmentIndex);
            this.modalDialogClose = !this.modalDialogClose;
        }
    }

    /* Form dirty modalpopup close*/
    onModalDialogCloseCancel(event) {
        this.ifEditedConfirmDialog = 0;
        if (event.index === -1 && !this.isSaveEnabled) {
            this.modalDialogClose = !this.modalDialogClose;
            if (this.modalDialogClose) {
                this.ifEditedConfirmDialog = 1;
            }
        }
        if (event.index === 1) {
            this.closeAdjustmentsSidePanel();
        }
        if (event.index === 0 || event.index === 2) {
            this.modalDialogClose = !this.modalDialogClose;
        }
    }

    setAdjustMentList() {
        const adjustList = this.adjustmentsTypesNameList;
        const adjustDropDownList = [];
        if (this.adjustmentsTypesNameList.length > 0) {
            const adjust = {
                'label': '',
                'value': '-1'
            };
            adjustDropDownList.push(adjust);
        }
        for (let index = 0; index < adjustList.length; index++) {
            if (adjustList[index] !== undefined) {
                const adjust = {
                    'label': adjustList[index].name,
                    'value': index
                };
                adjustDropDownList.push(adjust);
            }
        }
        this.adjustDropDownList = adjustDropDownList;
    }

    /*aside panel cancel button*/
    cancelCoverHandler() {
        if (this.isSaveEnabled === false) {
            this.ifEditedConfirmDialog = 1;
        } else {
            this.closeAdjustmentsSidePanel();
        }
        this.onToolTipClose();
        this.httpError = false;
        this.isAdjNamesClicked = false;
        this.adjNamesIndex = -1;
    }

    /* check for adjustment grid edited in aside panel*/
    adjustmentEdited(event) {
        if (event) {
            this.isSaveEnabled = false;
            this.isFormDirty.emit(true);
        } else {
            this.isSaveEnabled = true;
            this.isFormDirty.emit(false);
        }
    }

    /*adjustment reason checkbox checked*/
    reasonSelected(index, propId) {
        let isExist = false;
        const reasonCodes = this.newAdjustment[index].reasonCodes;
        for (const ind in reasonCodes) {
            if (ind !== undefined) {
                if (reasonCodes[ind].propId === propId) {
                    isExist = true;
                }
            }
        }
        return isExist;
    }
    changeadjType(event, rowindex) {
        this.adjustNames[rowindex] = event;
        this.changeSelectedAdjustment(rowindex);
    }
}

