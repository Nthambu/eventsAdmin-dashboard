import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { canActivateGuard } from './admin.guard';

export const routes: Routes = [
    {path:'',component:Login}, 
    {path:'login',component:Login},
    {path:'dashboard',canActivate: [canActivateGuard],component:Dashboard},
    {path:'**',component:Login}
];
