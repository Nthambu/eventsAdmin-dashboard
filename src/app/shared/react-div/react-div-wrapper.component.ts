import {
  Component,
  ElementRef,
  input,
  effect,
  viewChild,
  OnDestroy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Footer from './react-div'

@Component({
  selector: 'app-react-footer',
  standalone: true,
  template: `<div #footerContainer></div>`
})
export class ReactFooterWrapperComponent implements OnDestroy {
  footerContainer = viewChild.required<ElementRef<HTMLDivElement>>('footerContainer');

  private root: Root | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      // React uses window/document — only run in the browser, never on the SSR server
      if (!isPlatformBrowser(this.platformId)) return;

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
