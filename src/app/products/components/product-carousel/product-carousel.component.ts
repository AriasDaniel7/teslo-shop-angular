import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCarouselComponent implements AfterViewInit {
  images = input.required<string[]>();

  swiperDiv =
    viewChild.required<ElementRef<SwiperContainer>>('swiperContainer');

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    const swiperEl = element;

    const swiperOptions: SwiperOptions = {
      pagination: {
        clickable: true,
        enabled: false,
      },
      navigation: {
        enabled: true,
      },
      loop: this.images().length > 1,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
    };

    Object.assign(swiperEl, swiperOptions);
    swiperEl.initialize();
  }
}
