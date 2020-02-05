import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst'
})

export class LowerCasePipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value !== null){
    return value.charAt(0) + value.slice(1).toLowerCase();
    }
  }
}