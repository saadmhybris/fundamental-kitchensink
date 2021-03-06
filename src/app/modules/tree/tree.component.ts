import { Component } from '@angular/core';

import { DataService } from '../../services/data.service';

@Component({
    selector: 'tree-example',
    templateUrl: './tree.component.html'
})
export class TreeComponent {

    block: any;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.block = null;
        this.dataService.getBlock().subscribe(data => {
            setTimeout(() => {
                this.block = this.dataInstrument(data);
            }, 500)
        });
    }

    dataInstrument(data) {
        data.tx = data.tx.slice(0, 400);
        data.tx = data.tx.map(t => {
            t.expanded = false;
            t.inputs.expanded = false;
            t.out.expanded = false;
            t.totalOut = t.out.reduce( function(a, b){
                return a + b['value'];
            }, 0);
            t.totalIn = t.inputs.reduce( function(a, b){
                return a + b.prev_out['value'];
            }, 0);
            t.fees = t.totalIn - t.totalOut;
            return t;
        });
        data.allExpanded = false;
        return data;
    }

    toBTC(sat) {
        return sat / 100000000;
    }

    expandContractAll() {
        this.block.allExpanded = !this.block.allExpanded;
        for (let t of this.block.tx) {
            t.expanded = t.inputs.expanded = t.out.expanded = this.block.allExpanded;
            
        }
    }

}
