import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtil } from 'src/app/utils/form.util';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  formUtil = FormUtil;

  hasError = signal(false);
  errorMessage = signal<string | null>(null);

  hasSuccess = signal(false);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    const {
      email = '',
      password = '',
      fullName = '',
    } = this.registerForm.value;

    this.authService.register(email, password, fullName).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.hasError.set(false);
        this.successTimeout(3000);
      },
      error: (err) => {
        this.errorTimeout(3000);
        this.errorMessage.set(err.message);
      },
    });
  }

  private errorTimeout(ms: number) {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, ms);
  }

  private successTimeout(ms: number) {
    this.hasSuccess.set(true);
    setTimeout(() => {
      this.hasSuccess.set(false);
      this.registerForm.reset();
      this.router.navigate(['/auth/login']);
    }, ms);
  }
}
