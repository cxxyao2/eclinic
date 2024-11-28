import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addMinutes',
  standalone: true
})
export class AddMinutesPipe implements PipeTransform {

  transform(date: Date | string | number, minutes: number): Date {
    const currentDate = new Date(date);
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
    return currentDate;
  }

}
