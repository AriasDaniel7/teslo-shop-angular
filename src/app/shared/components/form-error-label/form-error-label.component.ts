import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtil } from '@utils/form.util';

@Component({
  selector: 'shared-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
  styleUrl: './form-error-label.component.scss',
})
export class FormErrorLabelComponent {
  control = input.required<AbstractControl>();

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtil.getTextError(errors)
      : null;
  }
}
