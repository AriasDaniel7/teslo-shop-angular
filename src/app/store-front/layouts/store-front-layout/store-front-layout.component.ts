import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FrontNavbarComponent } from '@store-front/components/front-navbar/front-navbar.component';

@Component({
  selector: 'store-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent],
  templateUrl: './store-front-layout.component.html',
  styleUrl: './store-front-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreFrontLayoutComponent {}
