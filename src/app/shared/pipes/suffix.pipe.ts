import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suffix',
  standalone: true,
})
export class SuffixPipe implements PipeTransform {
  transform(value: string, column: string): string {
    if (column === 'total') {
      return `R$ ${Number(value).toFixed(2)}`;
    }
    if (column === 'status') {
      return Boolean(value) ? 'Fechado' : 'Aberto';
    }
    return String(value);
  }
}
