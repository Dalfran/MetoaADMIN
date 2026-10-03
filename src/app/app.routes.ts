import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminLayout } from './layout/admin-layout/admin-layout';

import { Users } from './features/users/users';
import { UserDetail } from './features/users/user-detail/user-detail';

import { Drivers } from './features/drivers/drivers';

import { Trajets } from './features/trajets/trajets';

import { DriverDetail } from './features/drivers/driver-detail/driver-detail';

import { adminGuard } from './core/guards/admin.guard';

import { Reservations } from './features/reservations/reservations';

import { ReservationDetail } from './features/reservations/reservation-detail/reservation-detail';

import { TrajetDetail } from './features/trajets/trajet-detail/trajet-detail';


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
      },

      {
        path: 'drivers',
        component: Drivers
      },

      {
        path: 'drivers/:id',
        component: DriverDetail
      },
      {
        path: 'trajets',
        component: Trajets
      },
      { path: 'trajets/:id',
        component: TrajetDetail
      },
      { path: 'reservations',
        component: Reservations
      },
      { path: 'reservations/:id',
        component: ReservationDetail
      },


    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
