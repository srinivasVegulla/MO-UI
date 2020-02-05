import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textFilter'
})

export class TextFilterPipe implements PipeTransform {

    filteredArray: any[] = [];
    searchString: string;

    transform(items: any[], value: any): any {
        this.searchString = value;
        if (!items || !value) {
            return items;
        }
        const fileredItems = items.filter(item => {
            const retrunValue = item.search(new RegExp(value, 'i'));
            if (retrunValue >= 0) {
                return item;
            }
        });
        return fileredItems;
    }
}
