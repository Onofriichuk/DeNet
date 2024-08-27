import { Routes } from '@angular/router';
import {AuthComponent} from "../auth/auth.component";
import {FilesComponent} from "../files/files.component";

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'files', component: FilesComponent },
  { path: '**', redirectTo: '/auth' },
];
