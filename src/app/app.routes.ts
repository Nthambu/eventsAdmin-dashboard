import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { canActivateGuard } from './admin.guard';
import { ResetPassword } from './components/reset-password/reset-password';

export const routes: Routes = [
    {path:'',component:Login}, 
    {path:'login',component:Login},
    {path:'dashboard',canActivate: [canActivateGuard],component:Dashboard},
    {path:'reset-password',component:ResetPassword},
    {path:'**',component:Login}
];
