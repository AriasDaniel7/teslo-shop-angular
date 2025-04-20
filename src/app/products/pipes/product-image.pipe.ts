import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';

const baseUrl = environment.BASE_URL;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]) {
    const pathNoimage = '/assets/images/no-image.jpg';
    const path = `${baseUrl}/files/product/`;

    if (typeof value === 'string') {
      return `${path}${value}`;
    }

    const image = value.at(0);

    if (!image) {
      return pathNoimage;
    }

    return `${path}${image}`;
  }
}
