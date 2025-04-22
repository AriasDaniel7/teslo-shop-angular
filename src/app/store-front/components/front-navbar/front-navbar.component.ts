import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.component.html',
  styleUrl: './front-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontNavbarComponent {
  private authService = inject(AuthService);

  authSatuts = this.authService.authStatus;
  user = this.authService.user;

  isAdmin = this.authService.isAdmin;

  logout() {
    this.authService.logout();
  }
}
