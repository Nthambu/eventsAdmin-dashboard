import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "./services/auth";

export const canActivateGuard:CanActivateFn=(route,state)=>{
       const authService = inject(Auth);
  const token = authService.getToken(); 
    const router = inject(Router);
    // Check if the admin token is present in storage
  if (token) {
    return true; // Token exists, allow entry to the admin dashboard
  }
    // No token found, block access and redirect to login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url } // Optional: tracks where they were trying to go
  });
  
  return false;
}