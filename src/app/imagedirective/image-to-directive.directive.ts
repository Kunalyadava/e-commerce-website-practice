import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[img[errorImage]]',
  standalone: true
})
export class ImageToDirectiveDirective {

  @Input('errorImage') errorImageUrl: string=''

  constructor(private elementRef: ElementRef<HTMLImageElement>) { }

  @HostListener('error')
  onError() {
    if (this.errorImageUrl) {
      this.elementRef.nativeElement.src = this.errorImageUrl;
    }
  }

}
