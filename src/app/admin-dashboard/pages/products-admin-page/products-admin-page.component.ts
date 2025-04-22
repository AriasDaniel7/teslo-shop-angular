import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAdminPageComponent {
  private productsService = inject(ProductsService);
  private paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  currentPage = this.paginationService.currentPage;

  productsResource$ = rxResource({
    request: () => ({
      page: this.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
        limit: request.limit,
      });
    },
  });
}
