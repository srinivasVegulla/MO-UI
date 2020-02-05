import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Language } from 'angular-l10n';
import { utilService } from '../helpers/util.service';
import { TreeHierarchyService } from './treeHierarchy.service';
import { TreeModule,TreeNode } from 'primeng/primeng';

@Component({
  selector: 'ecb-treehierarchy',
  templateUrl: './treeHierarchy.component.html',
  styleUrls:  ['./treeHierarchy.component.scss'],
  providers:[TreeHierarchyService]
})
export class TreeHierarchyComponent implements OnInit {

    @Language() lang:  string;
    selectedOfferings:any = {}
    errorMessage:any;
    selectedOfferingsChildren: TreeNode[];
    selectedNode:any;

 constructor(private _utilService:utilService,
             private _treeHierarchyService: TreeHierarchyService) {
    }

    ngOnInit() {
    }

    getSelectedOffer(obj){
      this._treeHierarchyService.getSelectedOfferData({
      success : (result) => {
        this.selectedOfferings = result;
        this.selectedOfferingsChildren = this.selectedOfferings.children;
      },
      failure : (error) => {
        this.errorMessage = error;
      }
    });
    }
  }