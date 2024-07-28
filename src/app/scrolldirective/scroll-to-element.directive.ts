import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[appScrollToDirective]',
  standalone: true
})
export class ScrollToElementDirective {

  @Input() targetElementId: string = '';

  constructor(private el: ElementRef,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const paragraphId = params['id'];
      if (paragraphId) {
        this.targetElementId = paragraphId;
        this.scrollToElement();
      }
    });
  }
  @HostListener('click')
  onClick() {
    this.scrollToElement();
  }

  scrollToElement() {
    if (this.targetElementId) {
      const targetElement = document.getElementById(this.targetElementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}


