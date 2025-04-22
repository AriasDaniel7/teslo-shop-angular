import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'products-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent {
  products = input.required<Product[]>();
}
