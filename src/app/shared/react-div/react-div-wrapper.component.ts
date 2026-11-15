import {
  Component,
  ElementRef,
  input,
  effect,
  viewChild,
  OnDestroy
} from '@angular/core';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Footer from './react-div'
@Component({
  selector: 'app-react-footer',
  standalone: true,
  template: `<div #footerContainer></div>`
})
export class ReactFooterWrapperComponent implements OnDestroy {
  // Angular 20 signal-based inputs and viewChild
  // companyName = input.required<string>();
  // supportEmail = input<string>('support@example.com');
  footerContainer = viewChild.required<ElementRef<HTMLDivElement>>('footerContainer');

  private root: Root | null = null;

  constructor() {
    // Automatically mounts and re-renders whenever inputs change
    effect(() => {
      const container = this.footerContainer().nativeElement;

      if (!this.root) {
        this.root = createRoot(container);
      }

      this.root.render(createElement(Footer));
    });
  }

  ngOnDestroy(): void {
    this.root?.unmount();
  }
}
