import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';

import { of, tap } from 'rxjs';

const baseUrl = environment.BASE_URL;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(optinos: Options) {
    const { limit = 9, offset = 0, gender = '' } = optinos;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key));
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((resp) => this.productsCache.set(key, resp)));
  }

  getProductByIdSlug(idSlug: string) {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug));
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((resp) => this.productCache.set(idSlug, resp)));
  }

  getProductById(id: string) {
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id));
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => this.productCache.set(id, resp)));
  }

  updateProduct(id: string, productLike: Partial<Product>) {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });
  }
}
