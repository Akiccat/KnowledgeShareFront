import {Routes} from '@angular/router';
import {SideBarComponent} from "./pages/side-bar/side-bar.component";
import {UserTagControlRoutes} from "./pages/user-tag-control/user-tag-control.routes";

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
      {
        path: 'notedetail/:pageId/:noteId',
        loadChildren: () => import('./pages/note-detail/notedetail.routes').then(m => m.NOTEDETAIL_ROUTES)
      },
      {
        path: 'noteupdate/:noteId',
        loadChildren: () => import('./pages/update-note/updatenote.routes').then(m => m.UPDATENOTE_ROUTES)
      },
      {path: 'editnote', loadChildren: () => import('./pages/editnote/editnote.routes').then(m => m.EDITNOTE_ROUTES)},
      {path: 'starnote', loadChildren: () => import('./pages/star-note/starnote.routes').then(m => m.STARNOTE_ROUTES)},
      {path: 'useredit', loadChildren: () => import('./pages/user-edit/useredit.routes').then(m => m.USEREDIT_ROUTES)},
      {
        path: 'note-control',
        loadChildren: () => import('./pages/note-control-admin/note-control-admin.routes').then(m => m.NOTECONTROLADMIN_ROUTES)
      },
      {
        path: 'user-control',
        loadChildren: () => import('./pages/user-control-admin/user-control-admin.routes').then(m => m.USERCONTROLADMIN_ROUTES)
      },
      {
        path: 'admin-control',
        loadChildren: () => import('./pages/admin-control-superadmin/admin-control-superadmin.routes').then(m => m.ADMICONTROLSUPERADMIN_ROUTES)
      },
      {
        path: 'admin-set',
        loadChildren: () => import('./pages/set-admin-superadmin/set-admin-spueradmin.routes').then(m => m.SETADMIN_ROUTES)
      },
      {
        path: 'visualization',
        loadChildren: () => import('./pages/note-visualization/note-visualization.routes').then(m => m.NOTEVISUALIZATION_ROUTES)
      },
      {
        path: 'usernote',
        loadChildren: () => import('./pages/user-note-control/user-note-control.routes').then(m => m.UserNoteControlRoutes)
      },
      {
        path: 'usertag',
        loadChildren: () => import('./pages/user-tag-control/user-tag-control.routes').then(m => m.UserTagControlRoutes)
      }
    ]
  },
];
