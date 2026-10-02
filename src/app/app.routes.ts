import {
  Routes
} from '@angular/router';

import {
  LoginComponent
} from './pages/login/login';

import {
  Dashboard
} from './features/dashboard/dashboard';

import {
  AdminLayout
} from './layout/admin-layout/admin-layout';

import {
  Users
} from './features/users/users';

import { UserDetail } from './features/users/user-detail/user-detail';

import {
  adminGuard
} from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'users',
        component: Users
      },

      {
        path: 'users/:id',
        component: UserDetail
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
