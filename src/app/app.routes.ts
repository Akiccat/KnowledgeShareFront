import {Routes} from '@angular/router';
import {SideBarComponent} from "./pages/side-bar/side-bar.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/loginauth'},
  {
    path: 'loginauth',
    loadChildren: () => import('./pages/login-auth/login-auth.routes').then(m => m.LOGINAUYTH_ROUTES)
  },
  {
    path: 'mainpage', component: SideBarComponent,
    children: [
      {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)},
      {path: 'viewnote', loadChildren: () => import('./pages/viewnote/viewnote.routes').then(m => m.VIEWNOTE_ROUTES)},

    ]
  },
];
