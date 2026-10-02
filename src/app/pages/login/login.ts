import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    passe: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

  submit(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: () => {

          this.loading = false;

          if (!this.authService.isAdmin()) {

            this.authService.logout();

            this.errorMessage =
              'Ce compte ne possède pas les droits administrateur.';

            return;
          }

          this.router.navigate(['/admin/dashboard']);
        },

        error: error => {

          this.loading = false;

          console.error(
            '❌ Erreur connexion Admin :',
            error
          );

          if (error.status === 401) {

            this.errorMessage =
              'Email ou mot de passe incorrect.';

          } else if (error.status === 403) {

            this.errorMessage =
              'Accès administrateur refusé.';

          } else {

            this.errorMessage =
              'Impossible de se connecter au serveur.';
          }
        }
      });
  }
}
