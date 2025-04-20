import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderPageComponent {
  private activatedRoute = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private paginationService = inject(PaginationService);

  currentPage = this.paginationService.currentPage;

  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productsResource$ = rxResource({
    request: () => ({ gender: this.gender(), page: this.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9,
      });
    },
  });
}
