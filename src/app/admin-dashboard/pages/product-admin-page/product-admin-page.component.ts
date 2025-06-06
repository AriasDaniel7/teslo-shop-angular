import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
  styleUrl: './product-admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdminPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  router = inject(Router);

  productId = toSignal<string>(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id!);
    },
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });
}
