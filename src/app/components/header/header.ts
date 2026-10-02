import {
  Component,
  inject
} from '@angular/core';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private readonly authService =
    inject(AuthService);

  get user() {
    return this.authService.getStoredUser();
  }
}
