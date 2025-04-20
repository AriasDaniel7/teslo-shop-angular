import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent {
  private productsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);

  productIdSlug = signal<string>(this.activatedRoute.snapshot.params['idSlug']);

  productResource$ = rxResource({
    request: () => ({ idSlug: this.productIdSlug() }),
    loader: ({ request }) => {
      return this.productsService.getProductByIdSlug(request.idSlug);
    },
  });
}
