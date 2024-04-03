import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import {SideBarComponent} from "../side-bar/side-bar.component";

export const WELCOME_ROUTES: Routes = [
  { path: '', component: WelcomeComponent },
];
