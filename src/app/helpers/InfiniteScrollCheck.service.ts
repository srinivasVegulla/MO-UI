/*
Pagination Object Pattern -- Check in InfiniteScroll.directive.ts
------------------------------------------------------------------
initSize: initial no of records to be displayed in the grid
maxSize: max no of recordsthat can be displayed in the grid
moreIndex: After maxSize records moreIndex is the index from where we can delete
next: to shift the page to next count
page: page count
previous: to shift the page to previous count
reset: reset the page count to default 1 
scrollPageSize: enable page scroll for thhis count of records
size: size of records
 */
import { Component ,Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { retry } from 'rxjs/operator/retry';
import { utilService } from '../helpers/util.service';

@Injectable()
export class InfiniteScrollCheckService {
    data: any;
    dataReverse: any;
    moreData;
    lessData;
    totalPages;
    modalData: any = [];
    constructor(private _utilService: utilService) {}

    infiniteScrollData(records, scrollCheck, pagination, totalPageSize) {
        if (pagination.page === 1 && pagination.centerPageIndex === null && pagination.lastPageIndex === null) {
            this.data = new Array();
            return this.data = records;
        }
        if (scrollCheck === 'More') {
            this.data = this.data.concat(records);
            switch (+pagination.page) {
                case 2:
                    pagination.centerPageIndex = 2;
                    break;
                case 3:
                    pagination.lastPageIndex = 3;
                    break;
                default:
                    break;
            }
            if (this.data.length > pagination.maxSize) {
                this.data.splice(0, pagination.initSize);
                this.updatePageIndices(pagination, 'increment');
            }
            this._utilService.updateChangeScrollposition('modified');
            return this.data;
        } else if (scrollCheck === 'Less') {
            this.dataReverse = [];
            if (this.data.length >= pagination.maxSize) {
                this.data.splice(pagination.moreIndex, pagination.initSize);
                this.dataReverse = records.reverse();
                this.dataReverse.filter(item => {
                    this.data.unshift(item);
                });
                this.updatePageIndices(pagination, 'decrement');
            } else {
                this.data.splice(pagination.moreIndex, totalPageSize);
                this.dataReverse = records.reverse();
                this.dataReverse.filter(item => {
                    this.data.unshift(item);
                });
                this.updatePageIndices(pagination, 'decrement');
            }
            this._utilService.updateChangeScrollposition('Less');
            return this.data;
        }
    }

    infiniteScrollModalData(records, scrollCheck, pagination, totalPageSize) {
        if (pagination.page === 1 && pagination.centerPageIndex === null && pagination.lastPageIndex === null) {
            this.modalData = new Array();
            return this.modalData = records;
        }
        if (scrollCheck === 'More') {
            this.modalData = this.modalData.concat(records);
            switch (+pagination.page) {
                case 2:
                    pagination.centerPageIndex = 2;
                    break;
                case 3:
                    pagination.lastPageIndex = 3;
                    break;
                default:
                    break;
            }
            if (this.modalData.length > pagination.maxSize) {
                this.modalData.splice(0, pagination.initSize);
                this.updatePageIndices(pagination, 'increment');
            }
            this._utilService.updateChangeScrollposition('modified');
            return this.modalData;
        } else if (scrollCheck === 'Less') {
            this.dataReverse = [];
            if (this.modalData.length >= pagination.maxSize) {
                this.modalData.splice(pagination.moreIndex, pagination.initSize);
                this.dataReverse = records.reverse();
                this.dataReverse.filter(item => {
                    this.modalData.unshift(item);
                });
                this.updatePageIndices(pagination, 'decrement');
            } else {
                this.modalData.splice(pagination.moreIndex, totalPageSize);
                this.dataReverse = records.reverse();
                this.dataReverse.filter(item => {
                    this.modalData.unshift(item);
                });
                this.updatePageIndices(pagination, 'decrement');
            }
            this._utilService.updateChangeScrollposition('Less');
            return this.modalData;
        }
    }

    
    updatePageIndices(pagination, operation) {
        if (operation === 'increment') {
            pagination.firstPageIndex += 1;
            pagination.centerPageIndex += 1;
            pagination.lastPageIndex += 1;
        } else {
            pagination.firstPageIndex -= 1;
            pagination.centerPageIndex -= 1;
            pagination.lastPageIndex -= 1;
        }
    }

    getMoreScrollData(loader,data,pagination,totalSize,totalPages) {
        this.totalPages = totalPages;
        if (pagination.lastPageIndex !== null && pagination.page < pagination.lastPageIndex) {
            pagination.page = pagination.lastPageIndex;
        }
        if (loader && data > 0 && pagination.scrollPageSize === totalSize && totalPages > pagination.page) {
        pagination.next();
            this.moreData = {
                infiniteScrollCheck: 'More',
                moreDataCalled: true
            };
            return this.moreData;
        }
    }

  getLessScrollData(loader,data,pagination,moreDataCheck) {
      if (loader && data > 0 && pagination.lastPageIndex !== null && pagination.centerPageIndex !== null) {
      if (moreDataCheck && pagination.page >= (pagination.maxSize/pagination.initSize)+1) {
        pagination.page -= pagination.moreIndex/pagination.initSize;
      } else if (moreDataCheck && pagination.page === pagination.maxSize/pagination.initSize) {
        pagination.page -= 1;
      }
      if (pagination.page >= 2 && pagination.lastPageIndex > 3) {
          pagination.previous();
          this.lessData = {
              infiniteScrollCheck: 'Less',
              moreDataCalled: false
          };
          return this.lessData;
      } else {
          return null;
      }
    } else {
        return null;
    }
  }

  callProductDelete(existingRecords, productIndex, pagination) {
      if (pagination.page === 2) {
          existingRecords.splice(pagination.initSize, pagination.deleteIndex);
          return existingRecords;
      } else if (pagination.page > 2) {
          existingRecords.splice(pagination.moreIndex, pagination.deleteIndex);
          return existingRecords;
      }
  }
}
