import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtil } from '@utils/form.util';

@Component({
  selector: 'product-admin-page-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();
  formUtil = FormUtil;

  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(this.formUtil.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onSubmit() {
    const inInvalid = this.productForm.invalid;

    if (inInvalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    this.productsService
      .updateProduct(this.product().id, productLike)
      .subscribe((product) => {
        console.log('Producto acutualizado', product);
      });
  }
}
