import { Pipe, PipeTransform } from '@angular/core';

export class CSVFormat implements PipeTransform {
    transform(input: any, args: any): any {
        if (input === null) {return ''; }
        const format = '';
        const parsedFloat = 0;
        const pipeArgs = args.split(';');
        for (let i of pipeArgs.length) {
            pipeArgs[i] = pipeArgs[i].trim(' ');
        }

        switch (pipeArgs[0].toLowerCase()) {
            case 'text':
                return input;
            case 'date':
                return this.getDate(input);
            case 'csv':
                if (input.length === 0) { return ''; }
                if (input.length === 1) { return input[0].text; }
                let finalstr = '';
                for (let i = 0; i < input.length; i++)  {
                    finalstr = finalstr + input[i].text + ', ';
                }
                return finalstr.substring(0, finalstr.length - 2);
            default:
                return input;
        }
    }

    private getDate(date: string): any {
        return new Date(date).toLocaleDateString();
    }
}