import { Pipe, PipeTransform } from '@angular/core';

 @Pipe({ name: 'ObjectToArray' })
export class ObjectToArrayPipe implements PipeTransform {
    transform(obj: Object, args: any[] = null): any {
        let array = [];
        Object.keys(obj).forEach(key => {
            array.push({
                value: obj[key],
                key: key
            });
        });
        return array;
    }
}
