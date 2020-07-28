import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
@Pipe({
  name: 'safeHtmlPipe'
})
export class SafeHtmlPipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, ...args: unknown[]): unknown {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
