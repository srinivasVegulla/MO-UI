import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class dateFormatPipe implements PipeTransform {
    transform(value: any, format) {
       const datePipe = new DatePipe('en-US');
       try {
          return datePipe.transform(value, format);
       }catch (error) {
          return value;
       }
    }
}